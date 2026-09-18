import { Conteudo } from '@/components/Conteudo';
import { LinkButton } from '@/components/LinkButton';
import { Topbar } from '@/components/Topbar';
import { listarLojas, membrosPorLoja } from '@/lib/dados';
import { createClient } from '@/lib/supabase/server';
import { LojasLista } from './LojasLista';

export const metadata = { title: 'Lojas' };

export default async function LojasPage({ searchParams }) {
  const { msg } = await searchParams;
  const supabase = await createClient();
  const [lojas, porLoja] = await Promise.all([listarLojas(supabase), membrosPorLoja(supabase)]);
  return (
    <>
      <Topbar eyebrow="Registro" title="Lojas simbólicas"
        actions={<LinkButton href="/lojas/nova" size="sm" iconLeft="plus">Nova loja</LinkButton>} />
      <Conteudo>
        <LojasLista lojas={lojas} porLoja={porLoja} mensagem={typeof msg === 'string' ? msg : undefined} />
      </Conteudo>
    </>
  );
}
