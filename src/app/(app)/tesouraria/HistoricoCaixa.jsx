import { Badge, Card } from '@/ds';
import { FORMAS_PAGAMENTO, ORDEM_UI, ORDENS, TIPOS_LANCAMENTO, centavos, formatarData, formatarDataHora, formatarMoeda } from '@/lib/formatar';

const OPERACOES = { criado: ['Criado', 'success'], alterado: ['Alterado', 'warning'], excluido: ['Excluído', 'danger'] };

/** Campos comparados no histórico, na ordem em que aparecem. `ctx` = { categorias, irmaos } por id. */
const CAMPOS = [
  ['ordem', 'Ordem', (v) => ORDENS[ORDEM_UI[v]] ?? v],
  ['tipo', 'Tipo', (v) => TIPOS_LANCAMENTO[v] ?? v],
  ['data', 'Data', (v) => formatarData(v)],
  ['valor', 'Valor', (v) => formatarMoeda(centavos(v))],
  ['categoria_id', 'Categoria', (v, ctx) => ctx.categorias[v] ?? 'categoria excluída'],
  ['macom_id', 'Irmão', (v, ctx) => (v ? ctx.irmaos[v] ?? 'irmão fora do cadastro' : 'nenhum')],
  ['forma_pagamento', 'Forma de pagamento', (v) => (v ? FORMAS_PAGAMENTO[v] ?? v : 'não informada')],
  ['descricao', 'Descrição', (v) => v || 'vazia'],
];

/** Texto do evento: resumo do lançamento (criado, excluído) ou lista do que mudou (alterado). */
function descrever(e, ctx) {
  if (e.operacao === 'alterado') {
    const mudou = CAMPOS.filter(([k]) => (e.antes?.[k] ?? null) !== (e.depois?.[k] ?? null))
      .map(([k, rotulo, f]) => `${rotulo}: ${f(e.antes?.[k], ctx)} → ${f(e.depois?.[k], ctx)}`);
    return mudou.length ? mudou.join(' · ') : 'Sem mudança nos dados do lançamento.';
  }
  const l = e.depois ?? e.antes ?? {};
  return [`${TIPOS_LANCAMENTO[l.tipo] ?? ''} de ${formatarMoeda(centavos(l.valor))}`, formatarData(l.data), ORDENS[ORDEM_UI[l.ordem]], ctx.categorias[l.categoria_id], l.descricao].filter(Boolean).join(' · ');
}

/**
 * Histórico do caixa (tabela lancamento_caixa_historico, gravada por gatilho): quem criou,
 * alterou ou excluiu cada lançamento, quando, e o que mudou. Server Component.
 */
export function HistoricoCaixa({ eventos, categorias, irmaos, titulo = 'Histórico do caixa', vazio = 'Nenhum registro no histórico.' }) {
  const ctx = {
    categorias: Object.fromEntries(categorias.map((c) => [c.id, c.nome])),
    irmaos: Object.fromEntries(irmaos.map((i) => [i.id, i.nome])),
  };
  return (
    <Card eyebrow="Rastro de alterações" title={titulo}>
      {eventos.length === 0 && <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-faint)' }}>{vazio}</span>}
      <div style={{ display: 'grid' }}>
        {eventos.map((e, i) => {
          const [rotulo, tom] = OPERACOES[e.operacao] ?? [e.operacao, 'neutral'];
          return (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '150px 110px minmax(0, 1fr)', gap: 'var(--space-4)', alignItems: 'baseline', padding: 'var(--space-3) 0', borderTop: i === 0 ? 0 : '1px solid var(--border-subtle)' }}>
              <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{formatarDataHora(e.em)}</span>
              <span><Badge tone={tom} dot>{rotulo}</Badge></span>
              <div style={{ display: 'grid', gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-strong)', overflowWrap: 'anywhere' }}>
                  <span className="numeric">Nº {e.numero ?? '—'}</span> · {descrever(e, ctx)}
                </span>
                <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{e.por_email || 'sem sessão (carga inicial ou SQL)'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
