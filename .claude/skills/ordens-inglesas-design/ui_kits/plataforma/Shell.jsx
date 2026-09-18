const { Icon, IconButton, Tooltip, Badge } = window.OrdensInglesasDesignSystem_d5c0a9;

const NAV = [
  { key: 'painel', label: 'Painel', icon: 'layout-dashboard' },
  { key: 'cadastro', label: 'Cadastro de irmãos', icon: 'users-round' },
  { key: 'admissoes', label: 'Admissões', icon: 'scroll-text', count: 4 },
  { key: 'tesouraria', label: 'Tesouraria', icon: 'receipt-text' },
];
const NAV2 = [
  { key: 'capitulos', label: 'Capítulos e Arcas', icon: 'building-2' },
  { key: 'relatorios', label: 'Relatórios', icon: 'chart-no-axes-column' },
  { key: 'ajustes', label: 'Ajustes', icon: 'settings' },
];

function SideItem({ item, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', border: 0, cursor: 'pointer',
        padding: '8px 12px', borderRadius: 'var(--radius-2)', font: 'inherit', fontSize: 'var(--fs-sm)',
        background: active ? 'rgba(255,255,255,.10)' : hover ? 'rgba(255,255,255,.05)' : 'transparent',
        color: active ? 'var(--neutral-0)' : 'rgba(250,248,244,.72)',
        borderLeft: `2px solid ${active ? 'var(--gold-400)' : 'transparent'}`,
        transition: 'var(--transition-base)' }}>
      <Icon name={item.icon} size={16} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.count != null && <span className="numeric" style={{ fontSize: 'var(--fs-3xs)', color: 'var(--gold-300)' }}>{item.count}</span>}
    </button>
  );
}

function Sidebar({ screen, onNavigate }) {
  return (
    <aside style={{ width: 'var(--width-sidebar)', flex: '0 0 auto', background: 'var(--surface-navy)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <img src="../../assets/keystone.jpg" alt="" style={{ position: 'absolute', bottom: -30, left: -40, width: 260, filter: 'invert(1)', opacity: 0.06, mixBlendMode: 'screen', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '16px 16px 14px', borderBottom: '1px solid rgba(255,255,255,.10)' }}>
        <img src="../../assets/keystone.jpg" alt="" style={{ width: 26, filter: 'invert(1)', mixBlendMode: 'screen' }} />
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-lg)', color: 'var(--neutral-0)' }}>Ordens Inglesas</div>
          <div style={{ fontSize: 10, letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--gold-300)' }}>Controle interno</div>
        </div>
      </div>
      <nav style={{ display: 'grid', gap: 2, padding: 'var(--space-4) 10px' }}>
        {NAV.map((i) => <SideItem key={i.key} item={i} active={screen === i.key} onClick={() => onNavigate(i.key)} />)}
        <div style={{ height: 1, background: 'rgba(255,255,255,.10)', margin: '12px 12px' }} />
        {NAV2.map((i) => <SideItem key={i.key} item={i} active={screen === i.key} onClick={() => onNavigate(i.key)} />)}
      </nav>
      <div style={{ marginTop: 'auto', padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,.10)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--gold-500)', color: 'var(--navy-700)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontSize: 14 }}>AB</div>
        <div style={{ flex: 1, lineHeight: 1.2 }}>
          <div style={{ fontSize: 'var(--fs-2xs)', color: 'var(--neutral-0)' }}>Antônio V. Braga</div>
          <div style={{ fontSize: 10, color: 'rgba(250,248,244,.55)' }}>Escriba · Capítulo 12</div>
        </div>
        <IconButton icon="log-out" label="Sair" size="sm" style={{ color: 'rgba(250,248,244,.72)' }} />
      </div>
    </aside>
  );
}

function Topbar({ title, eyebrow, actions }) {
  return (
    <header style={{ minHeight: 'var(--height-topbar)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: '0 var(--space-6)', background: 'var(--surface-card)', borderBottom: '1px solid var(--border-default)' }}>
      <div style={{ flex: 1, display: 'grid', gap: 1 }}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h3 style={{ fontSize: 'var(--fs-xl)' }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {actions}
        <Tooltip label="Notificações"><IconButton icon="bell" label="Notificações" /></Tooltip>
        <Tooltip label="Ajuda"><IconButton icon="circle-help" label="Ajuda" /></Tooltip>
      </div>
    </header>
  );
}

function Shell({ screen, onNavigate, children }) {
  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'var(--font-body)' }}>
      <Sidebar screen={screen} onNavigate={onNavigate} />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>{children}</main>
    </div>
  );
}

function Placeholder({ label }) {
  return (
    <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--text-faint)', fontSize: 'var(--fs-sm)' }}>
      <div style={{ textAlign: 'center', display: 'grid', gap: 6 }}>
        <Icon name="square-dashed" size={22} style={{ margin: '0 auto' }} />
        <span>{label} — tela ainda não especificada pelo cliente.</span>
      </div>
    </div>
  );
}

Object.assign(window, { Shell, Sidebar, Topbar, Placeholder, SideItem });