'use client';
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Button, Card, DataTable, IconButton, Input, RowActions, Select, Tabs, Tag, Toast, Tooltip } from '@/ds';
import { ORDENS, TIPOS_LANCAMENTO, dataValida, formatarData, formatarMoeda, periodoDoAno, periodoDoMes } from '@/lib/formatar';

const MENSAGENS = {
  criado: ['Lançamento registrado', 'O saldo da Ordem foi atualizado.'],
  atualizado: ['Lançamento atualizado', 'As alterações foram gravadas.'],
  excluido: ['Lançamento excluído', 'O saldo da Ordem foi recalculado.'],
};

const TODAS = 'todas';

function LinhaResumo({ rotulo, valor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', fontSize: 'var(--fs-2xs)' }}>
      <span style={{ color: 'var(--text-muted)' }}>{rotulo}</span>
      <span className="numeric" style={{ color: 'var(--text-body)' }}>{formatarMoeda(valor)}</span>
    </div>
  );
}

/** Posição do caixa de uma Ordem no período: valores calculados no banco (caixa_resumo). */
function CaixaDaOrdem({ ordem, r }) {
  return (
    <Card accent={ordem} padding="var(--space-4) var(--space-5)">
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <span className="eyebrow">{ORDENS[ordem]}</span>
          <span className="numeric" style={{ fontSize: 'var(--fs-2xl)', lineHeight: 1, color: r.saldoFinal < 0 ? 'var(--status-danger-fg)' : 'var(--text-strong)' }}>{formatarMoeda(r.saldoFinal)}</span>
          <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>Saldo no fim do período</span>
        </div>
        <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
        <div style={{ display: 'grid', gap: 4 }}>
          <LinhaResumo rotulo="Saldo anterior" valor={r.saldoAnterior} />
          <LinhaResumo rotulo="Entradas" valor={r.entradas} />
          <LinhaResumo rotulo="Saídas" valor={-r.saidas} />
        </div>
      </div>
    </Card>
  );
}

export function TesourariaLista({ resumo, lancamentos, truncado, categorias, ordem, de, ate, mensagem }) {
  const router = useRouter();
  const [navegando, iniciarNavegacao] = useTransition();
  const [campoDe, setCampoDe] = useState(de);
  const [campoAte, setCampoAte] = useState(ate);
  const [tipo, setTipo] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [busca, setBusca] = useState('');
  const [toast, setToast] = useState(MENSAGENS[mensagem] || null);

  const filtros = (o, d, a) => new URLSearchParams({ ...(o && { ordem: o }), de: d, ate: a }).toString();
  const ir = (o, d, a) => {
    setCampoDe(d);
    setCampoAte(a);
    iniciarNavegacao(() => router.push(`/tesouraria?${filtros(o, d, a)}`));
  };
  const periodoDigitadoValido = dataValida(campoDe) && dataValida(campoAte) && campoDe <= campoAte;
  const voltar = filtros(ordem, de, ate);

  const categoriasDoTipo = useMemo(() => categorias.filter((c) => !tipo || c.tipo === tipo), [categorias, tipo]);

  const rows = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return lancamentos.filter((l) => {
      if (tipo && l.tipo !== tipo) return false;
      if (categoriaId && l.categoria_id !== categoriaId) return false;
      if (!q) return true;
      return (l.descricao || '').toLowerCase().includes(q)
        || (l.irmao?.nome || '').toLowerCase().includes(q)
        || (l.categoria?.nome || '').toLowerCase().includes(q);
    });
  }, [lancamentos, tipo, categoriaId, busca]);

  const total = useMemo(() => {
    let entradas = 0;
    let saidas = 0;
    for (const l of rows) {
      if (l.tipo === 'entrada') entradas += l.valor;
      else saidas += l.valor;
    }
    return { entradas, saidas };
  }, [rows]);

  const colunas = [
    { key: 'data', label: 'Data', numeric: true, render: (r) => formatarData(r.data) },
    ...(ordem ? [] : [{ key: 'ordem', label: 'Ordem', render: (r) => <Tag order={r.ordem}>{ORDENS[r.ordem]}</Tag> }]),
    { key: 'categoria', label: 'Categoria', strong: true, render: (r) => r.categoria?.nome ?? '—' },
    { key: 'descricao', label: 'Descrição', wrap: true, render: (r) => r.descricao || '—' },
    { key: 'irmao', label: 'Irmão', render: (r) => r.irmao?.nome ?? '—' },
    { key: 'tipo', label: 'Tipo', render: (r) => <Badge tone={r.tipo === 'entrada' ? 'success' : 'danger'} dot>{TIPOS_LANCAMENTO[r.tipo]}</Badge> },
    { key: 'valor', label: 'Valor (BRL)', numeric: true, align: 'right', render: (r) => formatarMoeda(r.tipo === 'entrada' ? r.valor : -r.valor, { simbolo: false }) },
    { key: 'acoes', label: '', align: 'right', render: (r) => (
      <RowActions>
        <Tooltip label="Editar"><IconButton icon="pencil" label="Editar" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/tesouraria/${r.id}/editar?${voltar}`); }} /></Tooltip>
      </RowActions>
    ) },
  ];

  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--space-6)', position: 'relative' }}>
      <div style={{ maxWidth: 'var(--width-content-max)', display: 'grid', gap: 'var(--space-6)', alignContent: 'start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          {Object.keys(ORDENS).map((o) => <CaixaDaOrdem key={o} ordem={o} r={resumo[o] ?? { saldoAnterior: 0, entradas: 0, saidas: 0, saldoFinal: 0 }} />)}
        </div>

        <Card padding="0">
          <div style={{ padding: 'var(--space-4) var(--space-5) 0' }}>
            <Tabs value={ordem || TODAS} onChange={(v) => ir(v === TODAS ? '' : v, de, ate)}
              items={[{ value: TODAS, label: 'Todas as Ordens' }, ...Object.entries(ORDENS).map(([value, label]) => ({ value, label }))]} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', padding: 'var(--space-4) var(--space-5) 0', flexWrap: 'wrap' }}>
            <Input label="De" type="date" value={campoDe} onChange={(e) => setCampoDe(e.target.value)} wrapperStyle={{ width: 160 }} />
            <Input label="Até" type="date" value={campoAte} onChange={(e) => setCampoAte(e.target.value)} wrapperStyle={{ width: 160 }} />
            <Button variant="secondary" disabled={!periodoDigitadoValido || navegando} onClick={() => ir(ordem, campoDe, campoAte)}>Aplicar período</Button>
            <Button variant="ghost" disabled={navegando} onClick={() => { const p = periodoDoMes(); ir(ordem, p.de, p.ate); }}>Mês atual</Button>
            <Button variant="ghost" disabled={navegando} onClick={() => { const p = periodoDoAno(); ir(ordem, p.de, p.ate); }}>Ano atual</Button>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
            <Input placeholder="Buscar por descrição, irmão ou categoria" iconLeft="search" value={busca} onChange={(e) => setBusca(e.target.value)} wrapperStyle={{ flex: '1 1 240px' }} />
            <Select placeholder="Entradas e saídas" value={tipo} onChange={(e) => { setTipo(e.target.value); setCategoriaId(''); }}
              options={[{ value: 'entrada', label: 'Só entradas' }, { value: 'saida', label: 'Só saídas' }]} wrapperStyle={{ width: 190 }} />
            <Select placeholder="Todas as categorias" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}
              options={categoriasDoTipo.map((c) => ({ value: c.id, label: tipo ? c.nome : `${c.nome} (${TIPOS_LANCAMENTO[c.tipo].toLowerCase()})` }))} wrapperStyle={{ width: 240 }} />
          </div>
          {truncado && (
            <p role="status" style={{ padding: 'var(--space-3) var(--space-5)', fontSize: 'var(--fs-2xs)', color: 'var(--status-warning-fg)', background: 'var(--status-warning-bg)' }}>
              O período tem mais lançamentos do que a lista comporta; aparecem os {lancamentos.length} mais recentes. Os saldos acima consideram todos.
            </p>
          )}
          <div style={{ padding: 'var(--space-4) 0', opacity: navegando ? 0.55 : 1, transition: 'var(--transition-base)' }}>
            <DataTable rows={rows} columns={colunas} onRowClick={(r) => router.push(`/tesouraria/${r.id}/editar?${voltar}`)}
              empty={lancamentos.length === 0 ? 'Nenhum lançamento neste período.' : 'Nenhum lançamento encontrado com esses critérios.'} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)' }}>
            <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{rows.length} de {lancamentos.length} lançamentos · {formatarData(de)} a {formatarData(ate)}</span>
            <span style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span className="eyebrow">Total exibido</span>
              <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>Entradas {formatarMoeda(total.entradas)}</span>
              <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>Saídas {formatarMoeda(-total.saidas)}</span>
              <span className="numeric" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-strong)' }}>{formatarMoeda(total.entradas - total.saidas)}</span>
            </span>
          </div>
        </Card>
      </div>
      {toast && (
        <div style={{ position: 'fixed', right: 'var(--space-6)', bottom: 'var(--space-6)', zIndex: 40 }}>
          <Toast tone="success" title={toast[0]} description={toast[1]} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}
