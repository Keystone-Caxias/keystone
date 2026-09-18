import Link from 'next/link';

export default function NaoEncontrado() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 'var(--space-6)' }}>
      <div style={{ display: 'grid', gap: 'var(--space-3)', textAlign: 'center' }}>
        <span className="eyebrow">Erro 404</span>
        <h1>Registro não encontrado.</h1>
        <p style={{ color: 'var(--text-muted)' }}>O endereço não corresponde a nenhuma tela ou registro.</p>
        <Link href="/">Voltar ao painel</Link>
      </div>
    </div>
  );
}
