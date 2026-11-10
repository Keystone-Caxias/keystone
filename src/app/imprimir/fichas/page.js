import { FichaIrmao } from '@/components/FichaIrmao';
import { Aviso, Folha } from '@/components/Folha';
import { listarIrmaosDaOrdem } from '@/lib/dados';
import { ORDENS, lerOrdem } from '@/lib/formatar';
import { createClient } from '@/lib/supabase/server';
import { BarraImpressao } from '../BarraImpressao';

export async function generateMetadata({ searchParams }) {
  const ordem = lerOrdem((await searchParams).ordem);
  return { title: ordem ? `Fichas · ${ORDENS[ordem]}` : 'Fichas' };
}

/** Fichas de registro de todos os irmãos de uma Ordem, uma por página. */
export default async function FichasPage({ searchParams }) {
  const ordem = lerOrdem((await searchParams).ordem);
  const supabase = await createClient();
  const [irmaos, { data: { user } }] = await Promise.all([
    ordem ? listarIrmaosDaOrdem(supabase, ordem) : [],
    supabase.auth.getUser(),
  ]);
  const emissao = { quando: new Date().toISOString(), quem: user?.email };
  return (
    <>
      <BarraImpressao voltar="/relatorios" eyebrow="Fichas de registro" podeImprimir={irmaos.length > 0}
        titulo={ordem ? `${ORDENS[ordem]} · ${irmaos.length} ${irmaos.length === 1 ? 'ficha' : 'fichas'}` : 'Ordem não informada'} />
      {irmaos.map((irmao) => <FichaIrmao key={irmao.id} irmao={irmao} modelo={ordem} emissao={emissao} />)}
      {irmaos.length === 0 && (
        <Folha ordem={ordem || undefined} eyebrow={ordem ? ORDENS[ordem] : undefined} titulo="Fichas de registro">
          <Aviso>{ordem ? `Nenhum irmão com registro em ${ORDENS[ordem]}.` : 'Escolha a Ordem em Relatórios para emitir as fichas.'}</Aviso>
        </Folha>
      )}
    </>
  );
}
