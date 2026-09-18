const { Button, Input, Checkbox } = window.OrdensInglesasDesignSystem_d5c0a9;

function Login({ onEnter }) {
  return (
    <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1.15fr 1fr', fontFamily: 'var(--font-body)' }}>
      <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface-navy-deep)', color: 'var(--text-inverse)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'var(--space-12)' }}>
        <img src="../../assets/keystone.jpg" alt="" style={{ position: 'absolute', right: -90, top: '50%', transform: 'translateY(-50%)', height: '105%', filter: 'invert(1)', opacity: 0.08, mixBlendMode: 'screen' }} />
        <div style={{ position: 'relative', display: 'flex', gap: 12, alignItems: 'center' }}>
          <img src="../../assets/keystone.jpg" alt="" style={{ width: 30, filter: 'invert(1)', mixBlendMode: 'screen' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-lg)' }}>Ordens Inglesas</span>
        </div>
        <div style={{ position: 'relative', maxWidth: 460 }}>
          <span className="eyebrow" style={{ color: 'var(--gold-300)' }}>Plataforma interna</span>
          <h1 style={{ fontSize: 'var(--fs-4xl)', color: 'var(--neutral-0)', marginTop: 8, lineHeight: 1.08 }}>Cadastro, admissão e finanças das três Ordens</h1>
          <div style={{ borderTop: 'var(--rule-ornament)', width: 96, margin: '20px 0' }} />
          <p style={{ fontSize: 'var(--fs-md)', color: 'rgba(250,248,244,.72)' }}>Arco Real · Mestre Maçom da Marca · Nautas da Arca Real</p>
        </div>
        <p style={{ position: 'relative', fontSize: 'var(--fs-2xs)', color: 'rgba(250,248,244,.45)' }}>Acesso restrito aos oficiais em exercício. Todo acesso é registrado.</p>
      </div>
      <div style={{ display: 'grid', placeItems: 'center', padding: 'var(--space-10)' }}>
        <form onSubmit={(e) => { e.preventDefault(); onEnter(); }} style={{ width: 340, display: 'grid', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gap: 4, marginBottom: 4 }}>
            <h2 style={{ fontSize: 'var(--fs-2xl)' }}>Entrar</h2>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>Use a matrícula do seu Capítulo ou Arca.</p>
          </div>
          <Input label="Matrícula" defaultValue="AR-2024-0117" iconLeft="id-card" required />
          <Input label="Senha" type="password" defaultValue="senha-secreta" iconLeft="lock" required />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Checkbox label="Manter sessão" />
            <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 'var(--fs-2xs)' }}>Esqueci a senha</a>
          </div>
          <Button type="submit" size="lg" fullWidth iconRight="arrow-right">Entrar na plataforma</Button>
          <p style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-faint)', textAlign: 'center' }}>Dúvidas de acesso: fale com o Escriba do seu Capítulo.</p>
        </form>
      </div>
    </div>
  );
}
window.Login = Login;