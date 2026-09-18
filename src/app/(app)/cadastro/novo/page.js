import { Conteudo } from '@/components/Conteudo';
import { LinkButton } from '@/components/LinkButton';
import { Topbar } from '@/components/Topbar';
import { listarLojas } from '@/lib/dados';
import { createClient } from '@/lib/supabase/server';
import { IrmaoForm } from '../IrmaoForm';

export const metadata = { title: 'Novo cadastro' };

export default async function NovoIrmaoPage() {
  const supabase = await createClient();
  const lojas = await listarLojas(supabase);
  return (
    <>
      <Topbar eyebrow="Cadastro de irmãos" title="Novo cadastro"
        actions={<LinkButton href="/cadastro" size="sm" variant="secondary">Voltar</LinkButton>} />
      <Conteudo>
        <IrmaoForm irmao={null} lojas={lojas} />
      </Conteudo>
    </>
  );
}
