import { Button } from '@/ds';
import { sair } from '@/app/login/actions';

/**
 * Mostrado a quem entrou com uma conta que não consta na tabela `oficial`.
 * `haOficiais` = false indica implantação nova: mostra o comando que define o primeiro administrador.
 */
export function AcessoPendente({ email, haOficiais }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 'var(--space-6)', background: 'var(--surface-page)' }}>
      <section style={{ width: 'min(100%, 560px)', background: 'var(--surface-card)', border: 'var(--border-hairline)', borderTop: '2px solid var(--order-marca)', borderRadius: 'var(--radius-3)', boxShadow: 'var(--shadow-1)', padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
        <span className="eyebrow">Acesso pendente</span>
        <h2>Esta conta ainda não foi autorizada.</h2>
        <p style={{ color: 'var(--text-body)' }}>
          A conta <strong className="numeric">{email}</strong> existe, mas não consta entre os oficiais autorizados a usar a plataforma.
          {haOficiais ? ' Peça a um administrador que a inclua em Ajustes, na seção Oficiais e acesso.' : ''}
        </p>
        {!haOficiais && (
          <>
            <p style={{ color: 'var(--text-body)' }}>Nenhum oficial foi cadastrado ainda. Para definir o primeiro administrador, execute no SQL Editor do Supabase:</p>
            <pre className="numeric" style={{ margin: 0, padding: 'var(--space-4)', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-2)', fontSize: 'var(--fs-xs)', overflow: 'auto' }}>
{`select public.oficial_definir('${email}', 'administrador');`}
            </pre>
            <p style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>Depois, recarregue esta página. Os demais oficiais são incluídos pela tela Ajustes.</p>
          </>
        )}
        <form action={sair}>
          <Button type="submit" variant="secondary" iconLeft="log-out">Sair</Button>
        </form>
      </section>
    </div>
  );
}
