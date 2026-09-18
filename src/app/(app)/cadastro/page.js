import { LinkButton } from '@/components/LinkButton';
import { Topbar } from '@/components/Topbar';
import { listarIrmaos, listarLojas } from '@/lib/dados';
import { createClient } from '@/lib/supabase/server';
import { CadastroLista } from './CadastroLista';

export const metadata = { title: 'Cadastro de irmãos' };

export default async function CadastroPage({ searchParams }) {
  const { msg } = await searchParams;
  const supabase = await createClient();
  const [irmaos, lojas] = await Promise.all([listarIrmaos(supabase), listarLojas(supabase)]);
  return (
    <>
      <Topbar eyebrow="Registro" title="Cadastro de irmãos"
        actions={<LinkButton href="/cadastro/novo" size="sm" iconLeft="plus">Novo cadastro</LinkButton>} />
      <CadastroLista irmaos={irmaos} lojas={lojas} mensagem={typeof msg === 'string' ? msg : undefined} />
    </>
  );
}
