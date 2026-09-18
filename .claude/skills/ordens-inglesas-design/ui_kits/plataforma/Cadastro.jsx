const { Card, Badge, Tag, Button, IconButton, Input, Select, DataTable, RowActions, Tabs, Icon, Tooltip } = window.OrdensInglesasDesignSystem_d5c0a9;

function Detalhe({ irmao, onClose }) {
  const [aba, setAba] = React.useState('dados');
  const linha = (k, v) => (
    <div key={k} style={{ display: 'grid', gap: 2 }}>
      <span className="eyebrow">{k}</span>
      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-strong)' }}>{v}</span>
    </div>
  );
  return (
    <aside style={{ width: 380, flex: '0 0 auto', background: 'var(--surface-card)', borderLeft: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <Tag order={irmao.ordem}>{window.ORDENS[irmao.ordem]}</Tag>
            <h3 style={{ fontSize: 'var(--fs-xl)' }}>{irmao.nome}</h3>
            <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{irmao.mat} · desde {irmao.desde}</span>
          </div>
          <IconButton icon="x" label="Fechar" onClick={onClose} />
        </div>
      </div>
      <div style={{ padding: '0 var(--space-5)', marginTop: 'var(--space-4)' }}>
        <Tabs value={aba} onChange={setAba} items={[{ value: 'dados', label: 'Dados' }, { value: 'graus', label: 'Graus', count: 3 }, { value: 'fin', label: 'Financeiro', count: 12 }]} />
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-5)', display: 'grid', gap: 'var(--space-4)', alignContent: 'start' }}>
        {aba === 'dados' && <>
          {linha('Grau atual', irmao.grau)}
          {linha('Capítulo / Arca', irmao.capitulo)}
          {linha('E-mail', irmao.email)}
          {linha('Situação financeira', <Badge tone={irmao.sit[0]} dot>{irmao.sit[1]}</Badge>)}
          <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button size="sm" iconLeft="pencil">Editar cadastro</Button>
            <Button size="sm" variant="secondary" iconLeft="printer">Ficha</Button>
          </div>
        </>}
        {aba === 'graus' && [['Companheiro exaltado', '14/03/2019'], ['Mestre da Marca', '08/09/2021'], ['Arco Real', '22/05/2024']].map(([g, d]) => (
          <div key={g} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-strong)' }}>{g}</span>
            <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{d}</span>
          </div>
        ))}
        {aba === 'fin' && window.LANCAMENTOS.slice(0, 4).map((l) => (
          <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'grid', gap: 1 }}>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-strong)' }}>{l.tipo}</span>
              <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{l.data} · {l.doc}</span>
            </div>
            <span className="numeric" style={{ fontSize: 'var(--fs-sm)' }}>R$ {l.valor}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function Cadastro() {
  const [sel, setSel] = React.useState(null);
  const [busca, setBusca] = React.useState('');
  const [ordem, setOrdem] = React.useState('');
  const rows = window.IRMAOS.filter((i) => (!ordem || i.ordem === ordem) && i.nome.toLowerCase().includes(busca.toLowerCase()));
  return (
    <>
      <Topbar eyebrow="Registro" title="Cadastro de irmãos"
        actions={<><Button size="sm" variant="secondary" iconLeft="upload">Importar</Button><Button size="sm" iconLeft="plus">Novo cadastro</Button></>} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: 'var(--space-6)' }}>
          <Card padding="0">
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}>
              <Input placeholder="Buscar por nome ou matrícula" iconLeft="search" value={busca} onChange={(e) => setBusca(e.target.value)} wrapperStyle={{ flex: 1 }} />
              <Select placeholder="Todas as Ordens" value={ordem} onChange={(e) => setOrdem(e.target.value)} options={Object.entries(window.ORDENS).map(([v, l]) => ({ value: v, label: l }))} wrapperStyle={{ width: 200 }} />
              <Button variant="secondary" iconLeft="funnel">Filtros</Button>
            </div>
            <div style={{ padding: 'var(--space-4) 0' }}>
              <DataTable rows={rows} selectedId={sel && sel.id} onRowClick={setSel} empty="Nenhum irmão encontrado com esses critérios."
                columns={[
                  { key: 'nome', label: 'Irmão', strong: true },
                  { key: 'mat', label: 'Matrícula', numeric: true },
                  { key: 'ordem', label: 'Ordem', render: (r) => <Tag order={r.ordem}>{window.ORDENS[r.ordem]}</Tag> },
                  { key: 'capitulo', label: 'Capítulo / Arca' },
                  { key: 'sit', label: 'Situação', render: (r) => <Badge tone={r.sit[0]} dot>{r.sit[1]}</Badge> },
                  { key: 'acoes', label: '', align: 'right', render: () => <RowActions><Tooltip label="Editar"><IconButton icon="pencil" label="Editar" size="sm" /></Tooltip><Tooltip label="Ficha"><IconButton icon="printer" label="Ficha" size="sm" /></Tooltip></RowActions> },
                ]} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)' }}>
              <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{rows.length} de 184 registros</span>
              <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                <IconButton icon="chevron-left" label="Anterior" size="sm" variant="outline" />
                <IconButton icon="chevron-right" label="Próxima" size="sm" variant="outline" />
              </div>
            </div>
          </Card>
        </div>
        {sel && <Detalhe irmao={sel} onClose={() => setSel(null)} />}
      </div>
    </>
  );
}
Object.assign(window, { Cadastro, Detalhe });