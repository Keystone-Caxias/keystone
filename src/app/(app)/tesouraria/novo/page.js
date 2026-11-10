import { Conteudo } from '@/components/Conteudo';
import { LinkButton } from '@/components/LinkButton';
import { Topbar } from '@/components/Topbar';
import { listarCategorias, listarIrmaosResumo } from '@/lib/dados';
import { hojeISO, lerOrdem, lerPeriodo } from '@/lib/formatar';
import { createClient } from '@/lib/supabase/server';
import { LancamentoForm } from '../LancamentoForm';

export const metadata = { title: 'Novo lançamento' };

export default async function NovoLancamentoPage({ searchParams }) {
  const sp = await searchParams;
  const volta = { ordem: lerOrdem(sp.ordem), ...lerPeriodo(sp.de, sp.ate) };
  const hrefLista = `/tesouraria?${new URLSearchParams({ ...(volta.ordem && { ordem: volta.ordem }), de: volta.de, ate: volta.ate })}`;
  const supabase = await createClient();
  const [categorias, irmaos] = await Promise.all([listarCategorias(supabase), listarIrmaosResumo(supabase)]);
  return (
    <>
      <Topbar eyebrow="Tesouraria" title="Novo lançamento"
        actions={<LinkButton href={hrefLista} size="sm" variant="secondary">Voltar</LinkButton>} />
      <Conteudo>
        <LancamentoForm lancamento={null} categorias={categorias} irmaos={irmaos}
          inicial={{ ordem: volta.ordem, data: hojeISO() }} volta={volta} hrefLista={hrefLista} />
      </Conteudo>
    </>
  );
}
