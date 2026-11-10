import { notFound } from 'next/navigation';
import { Aviso, Folha } from '@/components/Folha';
import { obterLancamento } from '@/lib/dados';
import { FORMAS_PAGAMENTO, ORDENS, formatarData, formatarMoeda, valorPorExtenso } from '@/lib/formatar';
import { createClient } from '@/lib/supabase/server';
import { BarraImpressao } from '../../BarraImpressao';

export async function generateMetadata({ params }) {
  return { title: `Recibo · ${(await params).id.slice(0, 8)}` };
}

const linha = { borderBottom: 'var(--border-strong)', minHeight: 22 };
const rotulo = { fontSize: 8.5, fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-muted)' };

/**
 * Recibo de uma entrada do caixa. O número é o do lançamento (sequencial, atribuído pelo banco).
 * Sem irmão vinculado, o nome de quem pagou sai em branco para preencher à mão.
 */
export default async function ReciboPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const [lancamento, { data: { user } }] = await Promise.all([obterLancamento(supabase, id), supabase.auth.getUser()]);
  if (!lancamento) notFound();
  const entrada = lancamento.tipo === 'entrada';
  const referente = [lancamento.categoria?.nome, lancamento.descricao].filter(Boolean).join(' · ');
  return (
    <>
      <BarraImpressao voltar={`/tesouraria/${lancamento.id}/editar`} eyebrow="Recibo" titulo={`Nº ${lancamento.numero} · ${ORDENS[lancamento.ordem]}`} podeImprimir={entrada} />
      <Folha ordem={lancamento.ordem} eyebrow={ORDENS[lancamento.ordem]} titulo="Recibo" subtitulo={`Nº ${lancamento.numero}`}
        emissao={{ quando: new Date().toISOString(), quem: user?.email }}>
        {!entrada && <Aviso>Recibos são emitidos apenas para entradas. Este lançamento é uma saída.</Aviso>}
        {entrada && (
          <>
            <div className="numeric" style={{ justifySelf: 'end', padding: '8px 14px', border: 'var(--border-strong)', fontSize: 18, color: 'var(--text-strong)' }}>{formatarMoeda(lancamento.valor)}</div>
            <p style={{ fontSize: 14, lineHeight: '26px', color: 'var(--text-strong)' }}>
              Recebemos de{' '}
              {lancamento.irmao?.nome
                ? <strong>{lancamento.irmao.nome}</strong>
                : <span style={{ ...linha, display: 'inline-block', width: '70%', verticalAlign: 'bottom' }} />}
              {' '}a importância de <strong>{formatarMoeda(lancamento.valor)}</strong> ({valorPorExtenso(lancamento.valor)}), referente a {referente || 'contribuição'}.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
              <div style={{ display: 'grid', gap: 3 }}><span style={rotulo}>Data do recebimento</span><span className="numeric" style={{ fontSize: 13 }}>{formatarData(lancamento.data)}</span></div>
              <div style={{ display: 'grid', gap: 3 }}><span style={rotulo}>Forma de pagamento</span><span style={{ fontSize: 13 }}>{FORMAS_PAGAMENTO[lancamento.forma_pagamento] ?? 'Não informada'}</span></div>
              <div style={{ display: 'grid', gap: 3 }}><span style={rotulo}>Caixa</span><span style={{ fontSize: 13 }}>{ORDENS[lancamento.ordem]}</span></div>
            </div>
            <div className="nao-quebrar" style={{ marginTop: 56, justifySelf: 'end', width: '55%', display: 'grid', gap: 4, textAlign: 'center' }}>
              <span style={linha} />
              <span style={rotulo}>Tesoureiro</span>
            </div>
          </>
        )}
      </Folha>
    </>
  );
}
