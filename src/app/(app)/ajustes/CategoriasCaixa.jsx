'use client';
import { useState, useTransition } from 'react';
import { Button, Card, DataTable, Dialog, IconButton, Input, RowActions, Select, Toast, Tooltip } from '@/ds';
import { TIPOS_LANCAMENTO } from '@/lib/formatar';
import { excluirCategoria, salvarCategoria } from './actions';

const TITULOS = { entrada: 'Entradas', saida: 'Saídas' };

export function CategoriasCaixa({ categorias }) {
  const [pendente, iniciar] = useTransition();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [erro, setErro] = useState(null);
  // dialogo: { modo: 'renomear' | 'excluir', categoria, nome, erro }
  const [dialogo, setDialogo] = useState(null);
  const [toast, setToast] = useState(null);

  const criar = (evento) => {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    iniciar(async () => {
      const r = await salvarCategoria(dados);
      if (r?.erro) { setErro(r.erro); return; }
      setErro(null);
      setNome('');
      setToast(['Categoria criada', `Já pode ser usada em lançamentos de ${TIPOS_LANCAMENTO[tipo].toLowerCase()}.`]);
    });
  };

  const confirmar = (evento) => {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    const { modo } = dialogo;
    iniciar(async () => {
      const r = await (modo === 'renomear' ? salvarCategoria(dados) : excluirCategoria(dados));
      if (r?.erro) { setDialogo((d) => (d ? { ...d, erro: r.erro } : d)); return; }
      setDialogo(null);
      setToast(modo === 'renomear'
        ? ['Categoria renomeada', 'Os lançamentos existentes passam a mostrar o novo nome.']
        : ['Categoria excluída', 'Ela não aparece mais no formulário de lançamento.']);
    });
  };

  const colunas = [
    { key: 'nome', label: 'Categoria', strong: true },
    { key: 'acoes', label: '', align: 'right', render: (c) => (
      <RowActions>
        <Tooltip label="Renomear"><IconButton icon="pencil" label="Renomear" size="sm" onClick={() => setDialogo({ modo: 'renomear', categoria: c, nome: c.nome, erro: null })} /></Tooltip>
        <Tooltip label="Excluir"><IconButton icon="trash-2" label="Excluir" size="sm" onClick={() => setDialogo({ modo: 'excluir', categoria: c, erro: null })} /></Tooltip>
      </RowActions>
    ) },
  ];

  return (
    <>
      <Card eyebrow="Tesouraria" title="Categorias do caixa">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', maxWidth: 'var(--width-form-max)' }}>
            As categorias classificam os lançamentos do caixa das três Ordens. Uma categoria já usada em lançamentos pode ser renomeada, mas não excluída.
          </p>
          <form onSubmit={criar} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Input label="Nova categoria" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} maxLength={60} placeholder="Nome da categoria" wrapperStyle={{ flex: '1 1 260px', maxWidth: 380 }} />
            <Select label="Tipo" name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} wrapperStyle={{ width: 160 }}
              options={Object.entries(TIPOS_LANCAMENTO).map(([value, label]) => ({ value, label }))} />
            <Button type="submit" iconLeft="plus" disabled={pendente || !nome.trim()}>Adicionar categoria</Button>
          </form>
          {erro && <p role="alert" style={{ color: 'var(--status-danger-fg)', fontSize: 'var(--fs-sm)' }}>{erro}</p>}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', alignItems: 'start' }}>
        {Object.keys(TIPOS_LANCAMENTO).map((t) => {
          const linhas = categorias.filter((c) => c.tipo === t);
          return (
            <Card key={t} eyebrow="Categorias" title={TITULOS[t]}>
              {/* A margem negativa leva tabela e rodapé até as bordas sem zerar o padding do cabeçalho do Card. */}
              <div style={{ margin: 'calc(var(--space-5) * -1)' }}>
                <div style={{ padding: 'var(--space-4) 0 var(--space-2)' }}>
                  <DataTable rows={linhas} columns={colunas} empty={`Nenhuma categoria de ${TIPOS_LANCAMENTO[t].toLowerCase()} cadastrada.`} />
                </div>
                <div style={{ padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)' }}>
                  <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{linhas.length} {linhas.length === 1 ? 'categoria' : 'categorias'}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {dialogo && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <form onSubmit={confirmar}>
            <input type="hidden" name="id" value={dialogo.categoria.id} />
            <Dialog width={460} onClose={() => setDialogo(null)}
              eyebrow={`Categoria de ${TIPOS_LANCAMENTO[dialogo.categoria.tipo].toLowerCase()}`}
              title={dialogo.modo === 'renomear' ? 'Renomear categoria' : 'Excluir categoria?'}
              description={dialogo.modo === 'excluir' ? `"${dialogo.categoria.nome}" deixa de existir. Só é possível excluir categorias sem lançamentos.` : undefined}
              footer={(
                <>
                  <Button size="sm" variant="secondary" onClick={() => setDialogo(null)}>Cancelar</Button>
                  {dialogo.modo === 'renomear'
                    ? <Button size="sm" iconLeft="check" type="submit" disabled={pendente || !dialogo.nome.trim()}>Salvar nome</Button>
                    : <Button size="sm" variant="accent" iconLeft="trash-2" type="submit" disabled={pendente}>Excluir categoria</Button>}
                </>
              )}>
              {(dialogo.modo === 'renomear' || dialogo.erro) && (
                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                  {dialogo.modo === 'renomear' && (
                    <Input label="Nome" name="nome" value={dialogo.nome} onChange={(e) => setDialogo((d) => ({ ...d, nome: e.target.value }))} maxLength={60} autoFocus />
                  )}
                  {dialogo.erro && <p role="alert" style={{ color: 'var(--status-danger-fg)', fontSize: 'var(--fs-sm)' }}>{dialogo.erro}</p>}
                </div>
              )}
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
