/** Mostrado quando as variáveis do Supabase não estão definidas (dev local ou deploy sem env). */
export function ConfiguracaoPendente() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 'var(--space-6)', background: 'var(--surface-page)' }}>
      <section style={{ width: 'min(100%, 560px)', background: 'var(--surface-card)', border: 'var(--border-hairline)', borderTop: '2px solid var(--order-marca)', borderRadius: 'var(--radius-3)', boxShadow: 'var(--shadow-1)', padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
        <span className="eyebrow">Configuração pendente</span>
        <h2>Supabase não configurado.</h2>
        <p style={{ color: 'var(--text-body)' }}>Defina as duas variáveis abaixo (em <code className="numeric">.env.local</code> no desenvolvimento, ou em Environment Variables na Vercel) e reinicie o app.</p>
        <pre className="numeric" style={{ margin: 0, padding: 'var(--space-4)', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-2)', fontSize: 'var(--fs-xs)', overflow: 'auto' }}>
{`NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...`}
        </pre>
        <p style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>Passo a passo completo no README.md do repositório.</p>
      </section>
    </div>
  );
}
