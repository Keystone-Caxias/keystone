'use client';
import { useActionState, useState } from 'react';
import { Button, Card, Dialog, Input, Select } from '@/ds';
import { LinkButton } from '@/components/LinkButton';
import { POTENCIAS } from '@/lib/formatar';
import { excluirLoja, salvarLoja } from './actions';

export function LojaForm({ loja }) {
  const [state, action, pending] = useActionState(salvarLoja, { erro: null });
  return (
    <form action={action} style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 'var(--width-form-max)' }}>
      {loja && <input type="hidden" name="id" value={loja.id} />}
      <Card eyebrow="Loja simbólica" title={loja ? 'Dados da loja' : 'Nova loja'}>
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Input label="Nome da loja (Craft)" name="nome" defaultValue={loja?.nome ?? ''} required autoFocus />
          <Select label="Potência simbólica" name="potencia_simbolica" defaultValue={loja?.potencia_simbolica ?? ''} placeholder="Selecione" options={POTENCIAS} required />
          <Input label="Endereço" name="endereco" defaultValue={loja?.endereco ?? ''} />
        </div>
      </Card>
      {state?.erro && <p role="alert" style={{ color: 'var(--status-danger-fg)', fontSize: 'var(--fs-sm)' }}>{state.erro}</p>}
      <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
        <LinkButton href="/lojas" variant="secondary" type="button">Cancelar</LinkButton>
        <Button type="submit" iconLeft="check" disabled={pending}>{pending ? 'Salvando' : loja ? 'Salvar alterações' : 'Cadastrar loja'}</Button>
      </div>
    </form>
  );
}

export function ExcluirLoja({ loja, membros }) {
  const [aberto, setAberto] = useState(false);
  const [state, action, pending] = useActionState(excluirLoja, { erro: null });
  return (
    <Card eyebrow="Zona de risco" title="Excluir loja" style={{ maxWidth: 'var(--width-form-max)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
          {membros > 0 ? `${membros} ${membros === 1 ? 'irmão está vinculado' : 'irmãos estão vinculados'} a esta loja; desvincule antes de excluir.` : 'Nenhum irmão vinculado. A exclusão não pode ser desfeita.'}
        </p>
        <Button size="sm" variant="danger" iconLeft="trash-2" onClick={() => setAberto(true)} disabled={membros > 0}>Excluir</Button>
      </div>
      {state?.erro && <p role="alert" style={{ color: 'var(--status-danger-fg)', fontSize: 'var(--fs-sm)', marginTop: 'var(--space-3)' }}>{state.erro}</p>}
      {aberto && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <Dialog title="Excluir loja?" eyebrow="Confirmação" description={`${loja.nome} será removida do registro.`} onClose={() => setAberto(false)} width={440}
            footer={(
              <>
                <Button size="sm" variant="secondary" onClick={() => setAberto(false)}>Cancelar</Button>
                <form action={action}>
                  <input type="hidden" name="id" value={loja.id} />
                  <Button size="sm" variant="accent" iconLeft="trash-2" type="submit" disabled={pending}>Excluir loja</Button>
                </form>
              </>
            )} />
        </div>
      )}
    </Card>
  );
}
