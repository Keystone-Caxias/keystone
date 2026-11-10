import { Conteudo } from '@/components/Conteudo';
import { Topbar } from '@/components/Topbar';
import { listarCategorias } from '@/lib/dados';
import { createClient } from '@/lib/supabase/server';
import { CategoriasCaixa } from './CategoriasCaixa';

export const metadata = { title: 'Ajustes' };

export default async function AjustesPage() {
  const supabase = await createClient();
  const categorias = await listarCategorias(supabase);
  return (
    <>
      <Topbar eyebrow="Configuração" title="Ajustes" />
      <Conteudo>
        <CategoriasCaixa categorias={categorias} />
      </Conteudo>
    </>
  );
}
