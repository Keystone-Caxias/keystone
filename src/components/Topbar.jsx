/** Barra fixa de 60px no topo da área de conteúdo (papel branco, filete inferior). */
export function Topbar({ title, eyebrow, actions }) {
  return (
    <header style={{ minHeight: 'var(--height-topbar)', flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: '0 var(--space-6)', background: 'var(--surface-card)', borderBottom: '1px solid var(--border-default)' }}>
      <div style={{ flex: 1, minWidth: 0, display: 'grid', gap: 1 }}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h3 style={{ fontSize: 'var(--fs-xl)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h3>
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>{actions}</div>}
    </header>
  );
}
