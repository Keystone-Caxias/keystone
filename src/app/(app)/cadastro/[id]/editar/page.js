import { notFound } from 'next/navigation';
import { Conteudo } from '@/components/Conteudo';
import { LinkButton } from '@/components/LinkButton';
import { Topbar } from '@/components/Topbar';
import { listarLojas, obterIrmao } from '@/lib/dados';
import { createClient } from '@/lib/supabase/server';
import { ExcluirIrmao } from '../../ExcluirIrmao';
import { IrmaoForm } from '../../IrmaoForm';

export const metadata = { title: 'Editar cadastro' };

export default async function EditarIrmaoPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const [irmao, lojas] = await Promise.all([obterIrmao(supabase, id), listarLojas(supabase)]);
  if (!irmao) notFound();
  return (
    <>
      <Topbar eyebrow="Cadastro de irmãos" title={irmao.nome}
        actions={(
          <>
            <LinkButton href={`/imprimir/ficha/${irmao.id}`} size="sm" variant="secondary" iconLeft="printer">Emitir ficha</LinkButton>
            <LinkButton href="/cadastro" size="sm" variant="secondary">Voltar</LinkButton>
          </>
        )} />
      <Conteudo>
        <IrmaoForm irmao={irmao} lojas={lojas} />
        <ExcluirIrmao id={irmao.id} nome={irmao.nome} />
      </Conteudo>
    </>
  );
}
