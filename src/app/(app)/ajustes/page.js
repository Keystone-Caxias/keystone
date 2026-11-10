import { Conteudo } from '@/components/Conteudo';
import { Topbar } from '@/components/Topbar';
import { obterAcesso } from '@/lib/acesso';
import { listarCategorias, listarFechamentos, listarOficiais } from '@/lib/dados';
import { hojeISO } from '@/lib/formatar';
import { createClient } from '@/lib/supabase/server';
import { CategoriasCaixa } from './CategoriasCaixa';
import { FechamentoCaixa } from './FechamentoCaixa';
import { MinhaSenha } from './MinhaSenha';
import { Oficiais } from './Oficiais';

export const metadata = { title: 'Ajustes' };

export default async function AjustesPage() {
  const supabase = await createClient();
  const [categorias, fechamentos, oficiais, { user, papel }] = await Promise.all([
    listarCategorias(supabase),
    listarFechamentos(supabase),
    listarOficiais(supabase),
    obterAcesso(supabase),
  ]);
  const administrador = papel === 'administrador';
  return (
    <>
      <Topbar eyebrow="Configuração" title="Ajustes" />
      <Conteudo>
        <Oficiais oficiais={oficiais} administrador={administrador} meuId={user?.id} />
        <FechamentoCaixa fechamentos={fechamentos} administrador={administrador} hoje={hojeISO()} />
        <CategoriasCaixa categorias={categorias} />
        <MinhaSenha email={user?.email} />
      </Conteudo>
    </>
  );
}
