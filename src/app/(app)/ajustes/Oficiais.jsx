'use client';
import { useState, useTransition } from 'react';
import { Badge, Button, Card, DataTable, Dialog, Input, Select, Toast } from '@/ds';
import { PAPEIS, PAPEIS_DESCRICAO } from '@/lib/formatar';
import { definirOficial, removerOficial } from './actions';

const TONS = { administrador: 'warning', oficial: 'success', leitura: 'neutral' };
const opcoesPapel = Object.entries(PAPEIS).map(([value, label]) => ({ value, label }));

/** Contas autorizadas a usar a plataforma. Só administradores alteram; os demais apenas veem a lista. */
export function Oficiais({ oficiais, administrador, meuId }) {
  const [pendente, iniciar] = useTransition();
  const [email, setEmail] = useState('');
  const [papel, setPapel] = useState('oficial');
  const [erro, setErro] = useState(null);
  const [remover, setRemover] = useState(null); // { oficial, erro }
  const [toast, setToast] = useState(null);

  const enviar = (dados, aoConcluir) => iniciar(async () => {
    const r = await definirOficial(dados);
    if (r?.erro) { setErro(r.erro); return; }
    setErro(null);
    aoConcluir();
  });
  const autorizar = (evento) => {
    evento.preventDefault();
    enviar(new FormData(evento.currentTarget), () => { setEmail(''); setToast(['Oficial autorizado', 'A conta já pode entrar na plataforma.']); });
  };
  const trocarPapel = (oficial, novo) => {
    const dados = new FormData();
    dados.set('email', oficial.email);
    dados.set('papel', novo);
    enviar(dados, () => setToast(['Papel alterado', `${oficial.email} agora é ${PAPEIS[novo].toLowerCase()}.`]));
  };
  const confirmarRemocao = (evento) => {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    iniciar(async () => {
      const r = await removerOficial(dados);
      if (r?.erro) { setRemover((d) => (d ? { ...d, erro: r.erro } : d)); return; }
      setRemover(null);
      setToast(['Acesso retirado', 'A conta não lê nem grava mais nada na plataforma.']);
    });
  };

  const colunas = [
    { key: 'email', label: 'Conta', strong: true, render: (o) => `${o.email}${o.user_id === meuId ? ' (você)' : ''}` },
    { key: 'papel', label: 'Papel', render: (o) => (administrador
      ? <Select aria-label={`Papel de ${o.email}`} value={o.papel} disabled={pendente} onChange={(e) => trocarPapel(o, e.target.value)} options={opcoesPapel} wrapperStyle={{ width: 190 }} />
      : <Badge tone={TONS[o.papel]}>{PAPEIS[o.papel]}</Badge>) },
    ...(administrador ? [{ key: 'acoes', label: '', align: 'right', render: (o) => (
      <Button size="sm" variant="ghost" iconLeft="trash-2" disabled={pendente} onClick={() => setRemover({ oficial: o, erro: null })}>Retirar acesso</Button>
    ) }] : []),
  ];

  return (
    <>
      <Card eyebrow="Segurança" title="Oficiais e acesso">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', maxWidth: 'var(--width-form-max)' }}>
            Só as contas desta lista leem ou gravam dados. A conta (e-mail e senha) é criada no painel do Supabase; aqui ela é autorizada e recebe um papel.
          </p>
          <ul style={{ margin: 0, paddingLeft: 'var(--space-5)', display: 'grid', gap: 2, fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>
            {Object.entries(PAPEIS).map(([k, nome]) => <li key={k}><strong style={{ color: 'var(--text-body)' }}>{nome}:</strong> {PAPEIS_DESCRICAO[k]}</li>)}
          </ul>
          {administrador && (
            <form onSubmit={autorizar} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <Input label="E-mail da conta" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="oficial@exemplo.com" wrapperStyle={{ flex: '1 1 260px', maxWidth: 380 }} />
              <Select label="Papel" name="papel" value={papel} onChange={(e) => setPapel(e.target.value)} options={opcoesPapel} wrapperStyle={{ width: 190 }} />
              <Button type="submit" iconLeft="plus" disabled={pendente || !email.trim()}>Autorizar conta</Button>
            </form>
          )}
          {!administrador && <p style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>Somente administradores alteram esta lista.</p>}
          {erro && <p role="alert" style={{ color: 'var(--status-danger-fg)', fontSize: 'var(--fs-sm)' }}>{erro}</p>}
          <div style={{ margin: '0 calc(var(--space-5) * -1) calc(var(--space-5) * -1)', padding: 'var(--space-2) 0', borderTop: '1px solid var(--border-subtle)' }}>
            <DataTable rows={oficiais.map((o) => ({ ...o, id: o.user_id }))} columns={colunas} empty="Nenhum oficial autorizado." />
          </div>
        </div>
      </Card>

      {remover && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <form onSubmit={confirmarRemocao}>
            <input type="hidden" name="user_id" value={remover.oficial.user_id} />
            <Dialog width={460} onClose={() => setRemover(null)} eyebrow="Oficiais e acesso" title="Retirar acesso?"
              description={`${remover.oficial.email} deixa de ler e gravar dados. A conta continua existindo no Supabase e pode ser autorizada de novo.`}
              footer={(
                <>
                  <Button size="sm" variant="secondary" onClick={() => setRemover(null)}>Cancelar</Button>
                  <Button size="sm" variant="accent" iconLeft="trash-2" type="submit" disabled={pendente}>Retirar acesso</Button>
                </>
              )}>
              {remover.erro && <p role="alert" style={{ color: 'var(--status-danger-fg)', fontSize: 'var(--fs-sm)' }}>{remover.erro}</p>}
            </Dialog>
          </form>
        </div>
      )}
      {toast && (
        <div style={{ position: 'fixed', right: 'var(--space-6)', bottom: 'var(--space-6)', zIndex: 40 }}>
          <Toast tone="success" title={toast[0]} description={toast[1]} onClose={() => setToast(null)} />
        </div>
      )}
    </>
  );
}
