import { Sidebar } from './Sidebar';

/** Sidebar navy fixa de 264px + área de conteúdo em coluna. */
export function Shell({ user, children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'var(--font-body)' }}>
      <Sidebar user={{ email: user.email, nome: user.user_metadata?.nome ?? user.user_metadata?.full_name ?? null }} />
      <main style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>{children}</main>
    </div>
  );
}
