import { Aviso, Folha, Secao, direita, td, th } from '@/components/Folha';
import { listarLancamentos, resumoCaixa } from '@/lib/dados';
import { ORDENS, formatarData, formatarMoeda, lerOrdem, lerPeriodo } from '@/lib/formatar';
import { createClient } from '@/lib/supabase/server';
import { BarraImpressao } from '../BarraImpressao';

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const ordem = lerOrdem(sp.ordem);
  const { de, ate } = lerPeriodo(sp.de, sp.ate);
  return { title: `Extrato do caixa · ${ordem ? ORDENS[ordem] : 'Todas as Ordens'} · ${de} a ${ate}` };
}

const moeda = (c) => formatarMoeda(c, { simbolo: false });
const forte = { color: 'var(--text-strong)', fontWeight: 'var(--fw-medium)' };

function Posicao({ rotulo, valor }) {
  return (
    <div style={{ display: 'grid', gap: 3 }}>
      <span style={{ fontSize: 8.5, fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{rotulo}</span>
      <span className="numeric" style={{ fontSize: 15, color: 'var(--text-strong)' }}>{formatarMoeda(valor)}</span>
    </div>
  );
}

/** Extrato de uma Ordem: posição do período (calculada no banco) e lançamentos com saldo acumulado. */
function ExtratoDaOrdem({ ordem, de, ate, resumo, lancamentos, truncado, emissao }) {
  // A lista vem do mais recente para o mais antigo; o extrato corre em ordem cronológica.
  const linhas = [];
  let saldo = resumo.saldoAnterior;
  for (const l of [...lancamentos].reverse()) {
    saldo += l.tipo === 'entrada' ? l.valor : -l.valor;
    linhas.push({ ...l, saldo });
  }
  return (
    <Folha ordem={ordem} eyebrow={ORDENS[ordem]} titulo="Extrato do caixa" subtitulo={`${formatarData(de)} a ${formatarData(ate)}`} emissao={emissao}>
      <div className="nao-quebrar" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14, padding: '10px 0', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <Posicao rotulo="Saldo anterior" valor={resumo.saldoAnterior} />
        <Posicao rotulo="Entradas" valor={resumo.entradas} />
        <Posicao rotulo="Saídas" valor={-resumo.saidas} />
        <Posicao rotulo="Saldo final" valor={resumo.saldoFinal} />
      </div>
      {truncado && <Aviso>O período tem mais lançamentos do que o extrato comporta. Emita o extrato em períodos menores; os valores acima consideram todos os lançamentos.</Aviso>}
      {!truncado && linhas.length === 0 && <Aviso>Nenhum lançamento neste período.</Aviso>}
      {!truncado && linhas.length > 0 && (
        <Secao titulo={`Lançamentos (${linhas.length})`}>
          <table>
            <thead>
              <tr>
                <th style={th}>Data</th>
                <th style={th}>Categoria</th>
                <th style={th}>Descrição</th>
                <th style={{ ...th, ...direita }}>Entrada</th>
                <th style={{ ...th, ...direita }}>Saída</th>
                <th style={{ ...th, ...direita }}>Saldo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="numeric" style={td}>{formatarData(de)}</td>
                <td style={{ ...td, color: 'var(--text-muted)' }} colSpan={4}>Saldo anterior</td>
                <td className="numeric" style={{ ...td, ...direita }}>{moeda(resumo.saldoAnterior)}</td>
              </tr>
              {linhas.map((l) => (
                <tr key={l.id}>
                  <td className="numeric" style={td}>{formatarData(l.data)}</td>
                  <td style={{ ...td, ...forte }}>{l.categoria?.nome ?? '—'}</td>
                  <td style={td}>{[l.descricao, l.irmao?.nome].filter(Boolean).join(' · ') || '—'}</td>
                  <td className="numeric" style={{ ...td, ...direita }}>{l.tipo === 'entrada' ? moeda(l.valor) : ''}</td>
                  <td className="numeric" style={{ ...td, ...direita }}>{l.tipo === 'saida' ? moeda(l.valor) : ''}</td>
                  <td className="numeric" style={{ ...td, ...direita }}>{moeda(l.saldo)}</td>
                </tr>
              ))}
              <tr>
                <td style={{ ...td, ...forte, borderBottom: 0 }} colSpan={3}>Totais do período e saldo final</td>
                <td className="numeric" style={{ ...td, ...direita, ...forte, borderBottom: 0 }}>{moeda(resumo.entradas)}</td>
                <td className="numeric" style={{ ...td, ...direita, ...forte, borderBottom: 0 }}>{moeda(resumo.saidas)}</td>
                <td className="numeric" style={{ ...td, ...direita, ...forte, borderBottom: 0 }}>{moeda(resumo.saldoFinal)}</td>
              </tr>
            </tbody>
          </table>
        </Secao>
      )}
    </Folha>
  );
}

/** Extrato do caixa por período; com `?ordem=`, só daquela Ordem, senão uma folha por Ordem. */
export default async function ExtratoPage({ searchParams }) {
  const sp = await searchParams;
  const ordem = lerOrdem(sp.ordem);
  const { de, ate } = lerPeriodo(sp.de, sp.ate);
  const ordens = ordem ? [ordem] : Object.keys(ORDENS);
  const supabase = await createClient();
  const [resumo, { data: { user } }, ...listas] = await Promise.all([
    resumoCaixa(supabase, { de, ate }),
    supabase.auth.getUser(),
    ...ordens.map((o) => listarLancamentos(supabase, { ordem: o, de, ate })),
  ]);
  const emissao = { quando: new Date().toISOString(), quem: user?.email };
  // Volta para de onde o oficial veio: a tela Relatórios (campo oculto `origem`) ou a Tesouraria com os mesmos filtros.
  const voltar = sp.origem === 'relatorios' ? '/relatorios' : `/tesouraria?${new URLSearchParams({ ...(ordem && { ordem }), de, ate })}`;
  return (
    <>
      <BarraImpressao voltar={voltar} eyebrow="Extrato do caixa" titulo={`${ordem ? ORDENS[ordem] : 'Todas as Ordens'} · ${formatarData(de)} a ${formatarData(ate)}`} />
      {ordens.map((o, i) => (
        <ExtratoDaOrdem key={o} ordem={o} de={de} ate={ate} emissao={emissao}
          resumo={resumo[o] ?? { saldoAnterior: 0, entradas: 0, saidas: 0, saldoFinal: 0 }}
          lancamentos={listas[i].linhas} truncado={listas[i].truncado} />
      ))}
    </>
  );
}
