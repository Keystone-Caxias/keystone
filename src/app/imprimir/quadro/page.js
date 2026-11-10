import { Aviso, Folha, td, th } from '@/components/Folha';
import { listarIrmaosDaOrdem } from '@/lib/dados';
import { ORDENS, SITUACOES, formatarData, hojeISO, lerOrdem } from '@/lib/formatar';
import { createClient } from '@/lib/supabase/server';
import { BarraImpressao } from '../BarraImpressao';

// Por Ordem: de onde vêm o nome do corpo e a data de ingresso no registro do irmão.
const COLUNAS = {
  'arco-real': { registro: 'arco_real', corpo: ['Capítulo', 'nome_capitulo'], ingresso: ['Exaltação', 'data_exaltacao'] },
  marca: { registro: 'marca', corpo: ['Loja da Marca', 'nome_loja_marca'], ingresso: ['Avançamento', 'data_avancamento'] },
  nautas: { registro: 'nauta', corpo: ['Loja de Nautas', 'nome_loja_nauta'], ingresso: ['Elevação', 'data_elevacao'] },
};

export async function generateMetadata({ searchParams }) {
  const ordem = lerOrdem((await searchParams).ordem);
  return { title: ordem ? `Quadro de irmãos · ${ORDENS[ordem]}` : 'Quadro de irmãos' };
}

/** Lista nominal dos irmãos com registro em uma Ordem. */
export default async function QuadroPage({ searchParams }) {
  const ordem = lerOrdem((await searchParams).ordem);
  const supabase = await createClient();
  const [irmaos, { data: { user } }] = await Promise.all([
    ordem ? listarIrmaosDaOrdem(supabase, ordem) : [],
    supabase.auth.getUser(),
  ]);
  const c = COLUNAS[ordem];
  return (
    <>
      <BarraImpressao voltar="/relatorios" eyebrow="Quadro de irmãos" titulo={ordem ? ORDENS[ordem] : 'Ordem não informada'} podeImprimir={irmaos.length > 0} />
      <Folha ordem={ordem || undefined} eyebrow={ordem ? ORDENS[ordem] : undefined} titulo="Quadro de irmãos"
        subtitulo={ordem ? `${irmaos.length} ${irmaos.length === 1 ? 'irmão' : 'irmãos'} no quadro em ${formatarData(hojeISO())} (ativos e licenciados)` : undefined}
        emissao={{ quando: new Date().toISOString(), quem: user?.email }}>
        {!ordem && <Aviso>Escolha a Ordem em Relatórios para emitir o quadro.</Aviso>}
        {ordem && irmaos.length === 0 && <Aviso>Nenhum irmão ativo ou licenciado em {ORDENS[ordem]}.</Aviso>}
        {irmaos.length > 0 && (
          <table>
            <thead>
              <tr>
                <th style={{ ...th, width: 24 }}>Nº</th>
                <th style={th}>Irmão</th>
                <th style={th}>CIM</th>
                <th style={th}>{c.corpo[0]}</th>
                <th style={th}>Loja simbólica</th>
                <th style={th}>{c.ingresso[0]}</th>
                <th style={th}>Situação</th>
                <th style={th}>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {irmaos.map((i, n) => {
                const registro = i[c.registro] || {};
                return (
                  <tr key={i.id}>
                    <td className="numeric" style={{ ...td, color: 'var(--text-muted)' }}>{n + 1}</td>
                    <td style={{ ...td, color: 'var(--text-strong)', fontWeight: 'var(--fw-medium)' }}>{i.nome}</td>
                    <td className="numeric" style={td}>{i.cim || '—'}</td>
                    <td style={td}>{registro[c.corpo[1]] || '—'}</td>
                    <td style={td}>{i.loja ? `${i.loja.nome} · ${i.loja.potencia_simbolica}` : '—'}</td>
                    <td className="numeric" style={td}>{formatarData(registro[c.ingresso[1]])}</td>
                    <td style={td}>{SITUACOES[registro.situacao] ?? '—'}</td>
                    <td className="numeric" style={td}>{i.telefone || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Folha>
    </>
  );
}
