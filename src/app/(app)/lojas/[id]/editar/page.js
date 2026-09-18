import { notFound } from 'next/navigation';
import { Conteudo } from '@/components/Conteudo';
import { LinkButton } from '@/components/LinkButton';
import { Topbar } from '@/components/Topbar';
import { membrosPorLoja, obterLoja } from '@/lib/dados';
import { createClient } from '@/lib/supabase/server';
import { ExcluirLoja, LojaForm } from '../../LojaForm';

export const metadata = { title: 'Editar loja' };

export default async function EditarLojaPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const [loja, porLoja] = await Promise.all([obterLoja(supabase, id), membrosPorLoja(supabase)]);
  if (!loja) notFound();
  return (
    <>
      <Topbar eyebrow="Lojas simbólicas" title={loja.nome}
        actions={<LinkButton href="/lojas" size="sm" variant="secondary">Voltar</LinkButton>} />
      <Conteudo>
        <LojaForm loja={loja} />
        <ExcluirLoja loja={loja} membros={porLoja[loja.id] ?? 0} />
      </Conteudo>
    </>
  );
}
