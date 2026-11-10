'use client';
import { useState, useTransition } from 'react';
import { Button, Card, Input, Toast } from '@/ds';
import { alterarSenha } from './actions';

/** Troca de senha da própria conta (as contas são criadas pelo administrador no painel do Supabase). */
export function MinhaSenha({ email }) {
  const [pendente, iniciar] = useTransition();
  const [nova, setNova] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState(null);
  const [toast, setToast] = useState(false);
  const enviar = (evento) => {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    iniciar(async () => {
      const r = await alterarSenha(dados);
      if (r?.erro) { setErro(r.erro); return; }
      setErro(null);
      setNova('');
      setConfirmacao('');
      setToast(true);
    });
  };
  return (
    <>
      <Card eyebrow="Minha conta" title="Alterar senha">
        <form onSubmit={enviar} style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', maxWidth: 'var(--width-form-max)' }}>
            Conta <span className="numeric">{email}</span>. Troque a senha provisória recebida do administrador no primeiro acesso.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Input label="Nova senha" name="nova" type="password" autoComplete="new-password" value={nova} onChange={(e) => setNova(e.target.value)} hint="Ao menos 8 caracteres" wrapperStyle={{ width: 260 }} />
            <Input label="Confirmar nova senha" name="confirmacao" type="password" autoComplete="new-password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} wrapperStyle={{ width: 260 }} />
          </div>
          {erro && <p role="alert" style={{ color: 'var(--status-danger-fg)', fontSize: 'var(--fs-sm)' }}>{erro}</p>}
          <div><Button type="submit" iconLeft="check" disabled={pendente || !nova || !confirmacao}>Alterar senha</Button></div>
        </form>
      </Card>
      {toast && (
        <div style={{ position: 'fixed', right: 'var(--space-6)', bottom: 'var(--space-6)', zIndex: 40 }}>
          <Toast tone="success" title="Senha alterada" description="Use a nova senha no próximo acesso." onClose={() => setToast(false)} />
        </div>
      )}
    </>
  );
}
