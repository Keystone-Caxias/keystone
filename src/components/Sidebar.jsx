'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Icon, IconButton } from '@/ds';
import { sair } from '@/app/login/actions';
import { Emblema, MarcaDagua } from './Emblema';

const NAV = [
  { href: '/', label: 'Painel', icon: 'layout-dashboard' },
  { href: '/cadastro', label: 'Cadastro de irmãos', icon: 'users-round' },
  { href: '/admissoes', label: 'Admissões', icon: 'scroll-text' },
  { href: '/tesouraria', label: 'Tesouraria', icon: 'receipt-text' },
];
const NAV2 = [
  { href: '/lojas', label: 'Lojas', icon: 'building-2' },
  { href: '/relatorios', label: 'Relatórios', icon: 'chart-no-axes-column' },
  { href: '/ajustes', label: 'Ajustes', icon: 'settings' },
];

function SideItem({ item, active }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={item.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '8px 12px', borderRadius: 'var(--radius-2)', fontSize: 'var(--fs-sm)',
        background: active ? 'rgba(255,255,255,.10)' : hover ? 'rgba(255,255,255,.05)' : 'transparent',
        color: active ? 'var(--neutral-0)' : 'rgba(250,248,244,.72)',
        borderBottom: 0,
        borderLeft: `2px solid ${active ? 'var(--gold-400)' : 'transparent'}`,
        transition: 'var(--transition-base)',
      }}
    >
      <Icon name={item.icon} size={16} />
      <span style={{ flex: 1 }}>{item.label}</span>
    </Link>
  );
}

function iniciais(texto) {
  return (texto || '?').split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
}

export function Sidebar({ user }) {
  const pathname = usePathname();
  const ativo = (href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));
  const nome = user.nome || user.email;
  return (
    <aside style={{ width: 'var(--width-sidebar)', flex: '0 0 auto', background: 'var(--surface-navy)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <MarcaDagua style={{ bottom: -30, left: -40, width: 260, opacity: 0.06 }} />
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '16px 16px 14px', borderBottom: '1px solid rgba(255,255,255,.10)' }}>
        <Emblema size={26} />
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-lg)', color: 'var(--neutral-0)' }}>Ordens Inglesas</div>
          <div style={{ fontSize: 10, letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--gold-300)' }}>Controle interno</div>
        </div>
      </div>
      <nav style={{ display: 'grid', gap: 2, padding: 'var(--space-4) 10px', position: 'relative' }}>
        {NAV.map((i) => <SideItem key={i.href} item={i} active={ativo(i.href)} />)}
        <div style={{ height: 1, background: 'rgba(255,255,255,.10)', margin: '12px 12px' }} />
        {NAV2.map((i) => <SideItem key={i.href} item={i} active={ativo(i.href)} />)}
      </nav>
      <div style={{ marginTop: 'auto', padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,.10)', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
        <div style={{ width: 30, height: 30, flex: '0 0 auto', borderRadius: '50%', background: 'var(--gold-500)', color: 'var(--navy-700)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontSize: 14 }}>{iniciais(nome)}</div>
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
          <div style={{ fontSize: 'var(--fs-2xs)', color: 'var(--neutral-0)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={user.email}>{nome}</div>
          <div style={{ fontSize: 10, color: 'rgba(250,248,244,.55)' }}>Oficial em exercício</div>
        </div>
        <form action={sair}>
          <IconButton icon="log-out" label="Sair" size="sm" type="submit" style={{ color: 'rgba(250,248,244,.72)' }} />
        </form>
      </div>
    </aside>
  );
}
