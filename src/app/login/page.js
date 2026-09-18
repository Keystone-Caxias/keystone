import { ConfiguracaoPendente } from '@/components/ConfiguracaoPendente';
import { Emblema, MarcaDagua } from '@/components/Emblema';
import { configurado } from '@/lib/supabase/env';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Entrar' };

export default async function LoginPage({ searchParams }) {
  if (!configurado()) return <ConfiguracaoPendente />;
  const { next } = await searchParams;
  const destino = typeof next === 'string' && next.startsWith('/') ? next : '/';
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)', fontFamily: 'var(--font-body)' }}>
      <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface-navy-deep)', color: 'var(--text-inverse)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'var(--space-12)' }}>
        <MarcaDagua style={{ right: -90, top: '50%', transform: 'translateY(-50%)', height: '105%', opacity: 0.08 }} />
        <div style={{ position: 'relative', display: 'flex', gap: 12, alignItems: 'center' }}>
          <Emblema size={30} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-lg)' }}>Ordens Inglesas</span>
        </div>
        <div style={{ position: 'relative', maxWidth: 460 }}>
          <span className="eyebrow" style={{ color: 'var(--gold-300)' }}>Plataforma interna</span>
          <h1 style={{ fontSize: 'var(--fs-4xl)', color: 'var(--neutral-0)', marginTop: 8, lineHeight: 1.08 }}>Cadastro e registro das três Ordens</h1>
          <div style={{ borderTop: 'var(--rule-ornament)', width: 96, margin: '20px 0' }} />
          <p style={{ fontSize: 'var(--fs-md)', color: 'rgba(250,248,244,.72)' }}>Arco Real · Mestre Maçom da Marca · Nautas da Arca Real</p>
        </div>
        <p style={{ position: 'relative', fontSize: 'var(--fs-2xs)', color: 'rgba(250,248,244,.45)' }}>Acesso restrito aos oficiais em exercício.</p>
      </div>
      <div style={{ display: 'grid', placeItems: 'center', padding: 'var(--space-10)' }}>
        <LoginForm next={destino} />
      </div>
    </div>
  );
}
