const { Card, Badge, Tag, Button, IconButton, Input, Select, DataTable, RowActions, Tabs, Switch } = window.OrdensInglesasDesignSystem_d5c0a9;

function Tesouraria() {
  const [aba, setAba] = React.useState('todos');
  const [auto, setAuto] = React.useState(true);
  const rows = window.LANCAMENTOS.filter((l) => aba === 'todos' || (aba === 'abertos' ? l.sit[1] !== 'Quite' : l.sit[1] === 'Quite'));
  const total = rows.reduce((s, l) => s + parseFloat(l.valor.replace(/\./g, '').replace(',', '.')), 0);
  return (
    <>
      <Topbar eyebrow="Exercício 2026" title="Tesouraria"
        actions={<><Button size="sm" variant="secondary" iconLeft="download">Extrato</Button><Button size="sm" iconLeft="plus">Novo lançamento</Button></>} />
      <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-6)', alignContent: 'start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
          <Metric eyebrow="Previsto" unit="R$" value="181.400" hint="184 irmãos ativos" />
          <Metric eyebrow="Arrecadado" unit="R$" value="148.320" hint="82% da previsão" tone="success" />
          <Metric eyebrow="Em atraso" unit="R$" value="9.640" hint="11 irmãos vencidos" tone="danger" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-6)', alignItems: 'start' }}>
          <Card padding="0">
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-end', padding: 'var(--space-4) var(--space-5) 0' }}>
              <Tabs value={aba} onChange={setAba} items={[{ value: 'todos', label: 'Todos' }, { value: 'abertos', label: 'Em aberto' }, { value: 'quitados', label: 'Quitados' }]} style={{ flex: 1 }} />
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}>
              <Input placeholder="Buscar irmão ou documento" iconLeft="search" wrapperStyle={{ flex: 1 }} />
              <Select placeholder="Todas as Ordens" options={Object.entries(window.ORDENS).map(([v, l]) => ({ value: v, label: l }))} wrapperStyle={{ width: 190 }} />
            </div>
            <div style={{ padding: 'var(--space-4) 0' }}>
              <DataTable rows={rows} empty="Nenhum lançamento nesta situação."
                columns={[
                  { key: 'doc', label: 'Documento', numeric: true, strong: true },
                  { key: 'data', label: 'Data', numeric: true },
                  { key: 'irmao', label: 'Irmão' },
                  { key: 'tipo', label: 'Tipo' },
                  { key: 'ordem', label: 'Ordem', render: (r) => <Tag order={r.ordem}>{window.ORDENS[r.ordem]}</Tag> },
                  { key: 'sit', label: 'Situação', render: (r) => <Badge tone={r.sit[0]} dot>{r.sit[1]}</Badge> },
                  { key: 'valor', label: 'Valor (BRL)', numeric: true, align: 'right' },
                  { key: 'acoes', label: '', align: 'right', render: () => <RowActions><IconButton icon="receipt-text" label="Recibo" size="sm" /><IconButton icon="ellipsis-vertical" label="Mais ações" size="sm" /></RowActions> },
                ]} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)' }}>
              <span className="eyebrow">Total exibido</span>
              <span className="numeric" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-strong)' }}>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </Card>
          <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
            <Card eyebrow="Cobrança" title="Anuidade 2026" accent="marca">
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}><span style={{ color: 'var(--text-muted)' }}>Arco Real</span><span className="numeric">R$ 1.240,00</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}><span style={{ color: 'var(--text-muted)' }}>Marca</span><span className="numeric">R$ 620,00</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}><span style={{ color: 'var(--text-muted)' }}>Nautas</span><span className="numeric">R$ 380,00</span></div>
                <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
                <Switch label="Cobrança automática" hint="Envia aviso 10 dias antes" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
              </div>
            </Card>
            <Card eyebrow="Atenção" title="Vencidos há mais de 60 dias">
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {window.IRMAOS.filter((i) => i.sit[1] === 'Vencido' || i.sit[1] === 'Pendente').map((i) => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'grid', gap: 1 }}>
                      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-strong)' }}>{i.nome}</span>
                      <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{i.mat}</span>
                    </div>
                    <Badge tone={i.sit[0]} dot>{i.sit[1]}</Badge>
                  </div>
                ))}
                <Button size="sm" variant="secondary" fullWidth iconLeft="mail">Enviar avisos</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
window.Tesouraria = Tesouraria;