'use client';
import { useActionState } from 'react';
import { Button, Input } from '@/ds';
import { entrar } from './actions';

export function LoginForm({ next }) {
  const [state, action, pending] = useActionState(entrar, { erro: null });
  return (
    <form action={action} style={{ width: 340, maxWidth: '100%', display: 'grid', gap: 'var(--space-4)' }}>
      <input type="hidden" name="next" value={next} />
      <div style={{ display: 'grid', gap: 4, marginBottom: 4 }}>
        <h2 style={{ fontSize: 'var(--fs-2xl)' }}>Entrar</h2>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>Use o e-mail e a senha cadastrados pelo Escriba.</p>
      </div>
      <Input label="E-mail" name="email" type="email" autoComplete="email" iconLeft="mail" required />
      <Input label="Senha" name="senha" type="password" autoComplete="current-password" iconLeft="lock" required error={state?.erro || undefined} />
      <Button type="submit" size="lg" fullWidth iconRight="arrow-right" disabled={pending}>
        {pending ? 'Entrando' : 'Entrar na plataforma'}
      </Button>
      <p style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-faint)', textAlign: 'center' }}>Dúvidas de acesso: fale com o Escriba do seu Capítulo.</p>
    </form>
  );
}
