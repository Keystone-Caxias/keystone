'use client';
import { useState } from 'react';
import { Button, Card, Dialog } from '@/ds';
import { excluirIrmao } from './actions';

export function ExcluirIrmao({ id, nome }) {
  const [aberto, setAberto] = useState(false);
  return (
    <Card eyebrow="Zona de risco" title="Excluir cadastro" style={{ maxWidth: 'var(--width-form-max)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>Remove o irmão e os seus registros de Arco Real, Marca e Nauta. Não pode ser desfeito.</p>
        <Button size="sm" variant="danger" iconLeft="trash-2" onClick={() => setAberto(true)}>Excluir</Button>
      </div>
      {aberto && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <Dialog title="Excluir cadastro?" eyebrow="Confirmação" description={`${nome} será removido do registro.`} onClose={() => setAberto(false)} width={440}
            footer={(
              <>
                <Button size="sm" variant="secondary" onClick={() => setAberto(false)}>Cancelar</Button>
                <form action={excluirIrmao}>
                  <input type="hidden" name="id" value={id} />
                  <Button size="sm" variant="accent" iconLeft="trash-2" type="submit">Excluir cadastro</Button>
                </form>
              </>
            )} />
        </div>
      )}
    </Card>
  );
}
