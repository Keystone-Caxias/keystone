import { notFound } from 'next/navigation';
import { Conteudo } from '@/components/Conteudo';
import { LinkButton } from '@/components/LinkButton';
import { Topbar } from '@/components/Topbar';
import { listarCategorias, listarFechamentos, listarHistorico, listarIrmaosResumo, obterLancamento } from '@/lib/dados';
import { ORDENS, TIPOS_LANCAMENTO, formatarMoeda, hojeISO, lerOrdem, lerPeriodo } from '@/lib/formatar';
import { createClient } from '@/lib/supabase/server';
import { HistoricoCaixa } from '../../HistoricoCaixa';
import { ExcluirLancamento, LancamentoForm } from '../../LancamentoForm';

export const metadata = { title: 'Editar lançamento' };

export default async function EditarLancamentoPage({ params, searchParams }) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const [lancamento, categorias, irmaos, fechamentos, historico] = await Promise.all([
    obterLancamento(supabase, id),
    listarCategorias(supabase),
    listarIrmaosResumo(supabase),
    listarFechamentos(supabase),
    listarHistorico(supabase, { lancamentoId: id }),
  ]);
  const travado = Boolean(fechamentos[lancamento.ordem]?.ate && lancamento.data <= fechamentos[lancamento.ordem].ate);
  if (!lancamento) notFound();
  const volta = { ordem: lerOrdem(sp.ordem), ...lerPeriodo(sp.de, sp.ate) };
  const hrefLista = `/tesouraria?${new URLSearchParams({ ...(volta.ordem && { ordem: volta.ordem }), de: volta.de, ate: volta.ate })}`;
  return (
    <>
      <Topbar eyebrow={`Tesouraria · ${ORDENS[lancamento.ordem]}`} title={`${TIPOS_LANCAMENTO[lancamento.tipo]} de ${formatarMoeda(lancamento.valor)}`}
        actions={(
          <>
            {lancamento.tipo === 'entrada' && <LinkButton href={`/imprimir/recibo/${lancamento.id}`} size="sm" variant="secondary" iconLeft="printer">Emitir recibo</LinkButton>}
            <LinkButton href={hrefLista} size="sm" variant="secondary">Voltar</LinkButton>
          </>
        )} />
      <Conteudo>
        <LancamentoForm lancamento={lancamento} categorias={categorias} irmaos={irmaos}
          fechamentos={fechamentos} hoje={hojeISO()}
          inicial={{ ordem: lancamento.ordem, data: lancamento.data }} volta={volta} hrefLista={hrefLista} />
        <HistoricoCaixa eventos={historico} categorias={categorias} irmaos={irmaos} titulo="Histórico deste lançamento" />
        {!travado && <ExcluirLancamento lancamento={lancamento} volta={volta} />}
      </Conteudo>
    </>
  );
}
