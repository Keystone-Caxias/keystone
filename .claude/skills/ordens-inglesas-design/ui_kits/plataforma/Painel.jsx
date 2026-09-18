const { Card, Badge, Tag, Button, DataTable, Icon } = window.OrdensInglesasDesignSystem_d5c0a9;

function Metric({ eyebrow, value, unit, hint, tone }) {
  return (
    <div style={{ background: 'var(--surface-card)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-3)', boxShadow: 'var(--shadow-1)', padding: 'var(--space-4) var(--space-5)', display: 'grid', gap: 6 }}>
      <span className="eyebrow">{eyebrow}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {unit && <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{unit}</span>}
        <span className="numeric" style={{ fontSize: 'var(--fs-3xl)', color: 'var(--text-strong)', lineHeight: 1 }}>{value}</span>
      </div>
      <span style={{ fontSize: 'var(--fs-2xs)', color: tone ? `var(--status-${tone}-fg)` : 'var(--text-muted)' }}>{hint}</span>
    </div>
  );
}

function Painel({ onNavigate }) {
  return (
    <>
      <Topbar eyebrow="Capítulo 12 · Recife" title="Painel do exercício 2026"
        actions={<><Button size="sm" variant="secondary" iconLeft="download">Exportar</Button><Button size="sm" iconLeft="plus" onClick={() => onNavigate('cadastro')}>Novo cadastro</Button></>} />
      <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-6)', alignContent: 'start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
          <Metric eyebrow="Irmãos ativos" value="184" hint="+6 no exercício" tone="success" />
          <Metric eyebrow="Admissões em curso" value="4" hint="2 aguardando parecer" tone="warning" />
          <Metric eyebrow="Arrecadado" unit="R$" value="148.320" hint="82% da previsão" />
          <Metric eyebrow="Em atraso" unit="R$" value="9.640" hint="11 irmãos vencidos" tone="danger" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 'var(--space-6)' }}>
          <Card eyebrow="Tesouraria" title="Últimos lançamentos" padding="0"
            actions={<Button size="sm" variant="ghost" iconRight="arrow-right" onClick={() => onNavigate('tesouraria')}>Ver tudo</Button>}>
            <div style={{ padding: 'var(--space-4) 0 var(--space-2)' }}>
              <DataTable rows={window.LANCAMENTOS.slice(0, 5)} columns={[
                { key: 'data', label: 'Data', numeric: true },
                { key: 'irmao', label: 'Irmão', strong: true },
                { key: 'tipo', label: 'Tipo' },
                { key: 'sit', label: 'Situação', render: (r) => <Badge tone={r.sit[0]} dot>{r.sit[1]}</Badge> },
                { key: 'valor', label: 'Valor (BRL)', numeric: true, align: 'right' },
              ]} />
            </div>
          </Card>
          <div style={{ display: 'grid', gap: 'var(--space-6)', alignContent: 'start' }}>
            <Card eyebrow="Composição" title="Irmãos por Ordem">
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {[['arco-real', 'Arco Real', 96, 'var(--order-arco-real)'], ['marca', 'Mestre da Marca', 58, 'var(--order-marca)'], ['nautas', 'Nautas da Arca Real', 30, 'var(--order-nautas)']].map(([k, label, n, c]) => (
                  <div key={k} style={{ display: 'grid', gap: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-2xs)', color: 'var(--text-body)' }}>
                      <span>{label}</span><span className="numeric">{n}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)' }}>
                      <div style={{ width: `${(n / 96) * 100}%`, height: '100%', background: c, borderRadius: 'var(--radius-pill)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card eyebrow="Agenda" title="Próximas sessões" accent="arco-real">
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {[['12/08', 'Sessão de exaltação', 'Capítulo 12 · Recife'], ['19/08', 'Instalação de oficiais', 'Loja da Marca 4'], ['02/09', 'Assembleia da Arca', 'Arca 2 · Jaboatão']].map(([d, t, l]) => (
                  <div key={d} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span className="numeric" style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-accent)', width: 42 }}>{d}</span>
                    <div style={{ display: 'grid', gap: 1 }}>
                      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-strong)' }}>{t}</span>
                      <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{l}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
Object.assign(window, { Painel, Metric });