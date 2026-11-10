import { Conteudo } from '@/components/Conteudo';
import { LinkButton } from '@/components/LinkButton';
import { Topbar } from '@/components/Topbar';
import { listarCategorias, listarHistorico, listarIrmaosResumo } from '@/lib/dados';
import { createClient } from '@/lib/supabase/server';
import { HistoricoCaixa } from '../HistoricoCaixa';

export const metadata = { title: 'Histórico do caixa' };

const LIMITE = 200;

/** Últimas criações, alterações e exclusões de lançamentos, nas três Ordens. */
export default async function HistoricoPage() {
  const supabase = await createClient();
  const [eventos, categorias, irmaos] = await Promise.all([
    listarHistorico(supabase, { limite: LIMITE }),
    listarCategorias(supabase),
    listarIrmaosResumo(supabase),
  ]);
  return (
    <>
      <Topbar eyebrow="Tesouraria" title="Histórico do caixa"
        actions={<LinkButton href="/tesouraria" size="sm" variant="secondary">Voltar</LinkButton>} />
      <Conteudo>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', maxWidth: 'var(--width-form-max)' }}>
          Todo lançamento criado, alterado ou excluído fica registrado aqui com o autor e a hora. O histórico não pode ser editado.
          {eventos.length === LIMITE ? ` Aparecem os ${LIMITE} registros mais recentes.` : ''}
        </p>
        <HistoricoCaixa eventos={eventos} categorias={categorias} irmaos={irmaos} titulo="Últimos registros" />
      </Conteudo>
    </>
  );
}
