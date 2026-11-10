'use client';
import { useActionState, useState } from 'react';
import { Button, Card, Dialog, Input, Radio, Select } from '@/ds';
import { LinkButton } from '@/components/LinkButton';
import { ORDENS, TIPOS_LANCAMENTO, formatarData, formatarDataHora, formatarMoeda } from '@/lib/formatar';
import { useEnvio } from '@/lib/useEnvio';
import { excluirLancamento, salvarLancamento } from './actions';

const grade = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', alignItems: 'start' };

/** Campos ocultos com os filtros da lista de onde o oficial veio (ver `lista` em actions.js). */
function Volta({ volta }) {
  return (
    <>
      <input type="hidden" name="volta_ordem" value={volta.ordem} />
      <input type="hidden" name="volta_de" value={volta.de} />
      <input type="hidden" name="volta_ate" value={volta.ate} />
    </>
  );
}

/** Formulário de lançamento (novo e edição). Envia por `useEnvio`: erro de validação não apaga nada. */
export function LancamentoForm({ lancamento, categorias, irmaos, inicial, volta, hrefLista }) {
  const [state, enviar, pending] = useEnvio(salvarLancamento);
  const [ordem, setOrdem] = useState(lancamento?.ordem ?? inicial.ordem);
  const [tipo, setTipo] = useState(lancamento?.tipo ?? 'entrada');
  const [data, setData] = useState(lancamento?.data ?? inicial.data);
  const [valor, setValor] = useState(lancamento ? formatarMoeda(lancamento.valor, { simbolo: false }) : '');
  const [categoriaId, setCategoriaId] = useState(lancamento?.categoria_id ?? '');
  const [macomId, setMacomId] = useState(lancamento?.macom_id ?? '');
  const [descricao, setDescricao] = useState(lancamento?.descricao ?? '');

  const categoriasDoTipo = categorias.filter((c) => c.tipo === tipo);
  const trocarTipo = (novo) => {
    setTipo(novo);
    if (!categorias.some((c) => c.id === categoriaId && c.tipo === novo)) setCategoriaId('');
  };

  return (
    <form onSubmit={enviar} style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 'var(--width-form-max)' }}>
      {lancamento && <input type="hidden" name="id" value={lancamento.id} />}
      <Volta volta={volta} />
      <Card eyebrow="Caixa das Ordens" title={lancamento ? 'Dados do lançamento' : 'Novo lançamento'} accent={ordem || undefined}>
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Select label="Ordem" name="ordem" value={ordem} onChange={(e) => setOrdem(e.target.value)} placeholder="Selecione" required
            options={Object.entries(ORDENS).map(([value, label]) => ({ value, label }))} />
          <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 6 }}>
            <legend style={{ padding: 0, marginBottom: 6, fontSize: 'var(--fs-2xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', letterSpacing: '0.02em' }}>Tipo</legend>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
              <Radio name="tipo" value="entrada" label={TIPOS_LANCAMENTO.entrada} hint="Dinheiro que entra no caixa" checked={tipo === 'entrada'} onChange={() => trocarTipo('entrada')} />
              <Radio name="tipo" value="saida" label={TIPOS_LANCAMENTO.saida} hint="Dinheiro que sai do caixa" checked={tipo === 'saida'} onChange={() => trocarTipo('saida')} />
            </div>
          </fieldset>
          <div style={grade}>
            <Input label="Data" name="data" type="date" value={data} onChange={(e) => setData(e.target.value)} required />
            <Input label="Valor (R$)" name="valor" inputMode="decimal" autoComplete="off" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} required
              hint="Exemplo: 1.240,50" className="numeric" autoFocus={!lancamento} />
          </div>
          <Select label="Categoria" name="categoria_id" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} placeholder="Selecione" required
            options={categoriasDoTipo.map((c) => ({ value: c.id, label: c.nome }))}
            hint={categoriasDoTipo.length === 0 ? 'Nenhuma categoria deste tipo. Cadastre em Ajustes.' : 'As categorias são mantidas em Ajustes.'} />
          <Select label="Irmão" name="macom_id" value={macomId} onChange={(e) => setMacomId(e.target.value)} placeholder="Sem irmão vinculado"
            options={irmaos.map((i) => ({ value: i.id, label: i.nome }))} hint="Opcional. Use quando o lançamento for de um irmão, como anuidade ou joia." />
          <Input label="Descrição" name="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} maxLength={500} hint="Opcional." />
        </div>
      </Card>

      {lancamento && (
        <p className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>
          Lançado{lancamento.criado_por_email ? ` por ${lancamento.criado_por_email}` : ''} em {formatarDataHora(lancamento.created_at)}
          {lancamento.updated_at !== lancamento.created_at ? ` · última alteração em ${formatarDataHora(lancamento.updated_at)}` : ''}
        </p>
      )}
      {state?.erro && <p role="alert" style={{ color: 'var(--status-danger-fg)', fontSize: 'var(--fs-sm)' }}>{state.erro}</p>}
      <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
        <LinkButton href={hrefLista} variant="secondary" type="button">Cancelar</LinkButton>
        <Button type="submit" iconLeft="check" disabled={pending}>{pending ? 'Salvando' : lancamento ? 'Salvar alterações' : 'Registrar lançamento'}</Button>
      </div>
    </form>
  );
}

export function ExcluirLancamento({ lancamento, volta }) {
  const [aberto, setAberto] = useState(false);
  const [state, action, pending] = useActionState(excluirLancamento, { erro: null });
  const resumo = `${TIPOS_LANCAMENTO[lancamento.tipo]} de ${formatarMoeda(lancamento.valor)} em ${formatarData(lancamento.data)}, ${ORDENS[lancamento.ordem]}`;
  return (
    <Card eyebrow="Zona de risco" title="Excluir lançamento" style={{ maxWidth: 'var(--width-form-max)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>Remove o lançamento e recalcula o saldo da Ordem. Não pode ser desfeito.</p>
        <Button size="sm" variant="danger" iconLeft="trash-2" onClick={() => setAberto(true)}>Excluir</Button>
      </div>
      {state?.erro && <p role="alert" style={{ color: 'var(--status-danger-fg)', fontSize: 'var(--fs-sm)', marginTop: 'var(--space-3)' }}>{state.erro}</p>}
      {aberto && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <Dialog title="Excluir lançamento?" eyebrow="Confirmação" description={`${resumo}. O lançamento sai do caixa.`} onClose={() => setAberto(false)} width={460}
            footer={(
              <>
                <Button size="sm" variant="secondary" onClick={() => setAberto(false)}>Cancelar</Button>
                <form action={action}>
                  <input type="hidden" name="id" value={lancamento.id} />
                  <Volta volta={volta} />
                  <Button size="sm" variant="accent" iconLeft="trash-2" type="submit" disabled={pending}>Excluir lançamento</Button>
                </form>
              </>
            )} />
        </div>
      )}
    </Card>
  );
}
