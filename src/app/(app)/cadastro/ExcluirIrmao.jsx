'use client';
import { useActionState, useState } from 'react';
import { Button, Card, Dialog } from '@/ds';
import { excluirIrmao } from './actions';

export function ExcluirIrmao({ id, nome }) {
  const [aberto, setAberto] = useState(false);
  const [state, action, pending] = useActionState(excluirIrmao, { erro: null });
  // A recusa chega depois do envio: fecha a confirmação e mostra o motivo no cartão.
  const [erroVisto, setErroVisto] = useState(state);
  if (state !== erroVisto) {
    setErroVisto(state);
    if (state?.erro) setAberto(false);
  }
  return (
    <Card eyebrow="Zona de risco" title="Excluir cadastro" style={{ maxWidth: 'var(--width-form-max)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>Remove o irmão e os seus registros de Arco Real, Marca e Nauta. Não pode ser desfeito.</p>
        <Button size="sm" variant="danger" iconLeft="trash-2" onClick={() => setAberto(true)}>Excluir</Button>
      </div>
      {state?.erro && <p role="alert" style={{ color: 'var(--status-danger-fg)', fontSize: 'var(--fs-sm)', marginTop: 'var(--space-3)' }}>{state.erro}</p>}
      {aberto && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <Dialog title="Excluir cadastro?" eyebrow="Confirmação" description={`${nome} será removido do registro.`} onClose={() => setAberto(false)} width={440}
            footer={(
              <>
                <Button size="sm" variant="secondary" onClick={() => setAberto(false)}>Cancelar</Button>
                <form action={action}>
                  <input type="hidden" name="id" value={id} />
                  <Button size="sm" variant="accent" iconLeft="trash-2" type="submit" disabled={pending}>Excluir cadastro</Button>
                </form>
              </>
            )} />
        </div>
      )}
    </Card>
  );
}
