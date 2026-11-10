import { LinkButton } from '@/components/LinkButton';
import { Topbar } from '@/components/Topbar';
import { listarCategorias, listarLancamentos, resumoCaixa } from '@/lib/dados';
import { lerOrdem, lerPeriodo } from '@/lib/formatar';
import { createClient } from '@/lib/supabase/server';
import { TesourariaLista } from './TesourariaLista';

export const metadata = { title: 'Tesouraria' };

export default async function TesourariaPage({ searchParams }) {
  const sp = await searchParams;
  const ordem = lerOrdem(sp.ordem);
  const { de, ate } = lerPeriodo(sp.de, sp.ate);
  const supabase = await createClient();
  const [resumo, lancamentos, categorias] = await Promise.all([
    resumoCaixa(supabase, { de, ate }),
    listarLancamentos(supabase, { ordem, de, ate }),
    listarCategorias(supabase),
  ]);
  const filtros = new URLSearchParams({ ...(ordem && { ordem }), de, ate }).toString();
  return (
    <>
      <Topbar eyebrow="Caixa das Ordens" title="Tesouraria"
        actions={(
          <>
            <LinkButton href={`/imprimir/extrato?${filtros}`} size="sm" variant="secondary" iconLeft="printer">Emitir extrato</LinkButton>
            <LinkButton href={`/tesouraria/novo?${filtros}`} size="sm" iconLeft="plus">Novo lançamento</LinkButton>
          </>
        )} />
      <TesourariaLista resumo={resumo} lancamentos={lancamentos.linhas} truncado={lancamentos.truncado} categorias={categorias}
        ordem={ordem} de={de} ate={ate} mensagem={typeof sp.msg === 'string' ? sp.msg : undefined} />
    </>
  );
}
