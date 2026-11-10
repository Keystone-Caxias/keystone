import { notFound } from 'next/navigation';
import { FichaIrmao, MODELOS_FICHA, lerModeloFicha } from '@/components/FichaIrmao';
import { obterIrmao } from '@/lib/dados';
import { createClient } from '@/lib/supabase/server';
import { BarraImpressao } from '../../BarraImpressao';

// O título da página vira o nome sugerido do arquivo ao salvar em PDF.
export async function generateMetadata({ params, searchParams }) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const modelo = lerModeloFicha(sp.modelo);
  const supabase = await createClient();
  const irmao = await obterIrmao(supabase, id);
  const documento = modelo === 'cadastral' ? 'Ficha cadastral' : `Ficha ${MODELOS_FICHA[modelo]}`;
  return { title: irmao ? `${documento} · ${irmao.nome}` : 'Ficha' };
}

export default async function FichaPage({ params, searchParams }) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const modelo = lerModeloFicha(sp.modelo);
  const supabase = await createClient();
  const [irmao, { data: { user } }] = await Promise.all([obterIrmao(supabase, id), supabase.auth.getUser()]);
  if (!irmao) notFound();
  return (
    <>
      <BarraImpressao voltar="/cadastro" eyebrow="Ficha do irmão" titulo={irmao.nome} atual={modelo}
        opcoes={Object.entries(MODELOS_FICHA).map(([valor, label]) => ({ valor, label, href: `/imprimir/ficha/${irmao.id}?modelo=${valor}` }))} />
      <FichaIrmao irmao={irmao} modelo={modelo} emissao={{ quando: new Date().toISOString(), quem: user?.email }} />
    </>
  );
}
