const { Card, Badge, Tag, Button, IconButton, Dialog, Toast, DataTable, RowActions, Tabs, Icon, Checkbox } = window.OrdensInglesasDesignSystem_d5c0a9;

function Passos({ etapa }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {window.ETAPAS.map((e, i) => (
        <React.Fragment key={e}>
          <span title={e} style={{ width: 18, height: 18, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 10, fontFamily: 'var(--font-mono)',
            background: i < etapa ? 'var(--verde-500)' : i === etapa ? 'var(--gold-500)' : 'var(--neutral-100)',
            color: i <= etapa ? 'var(--neutral-0)' : 'var(--text-faint)' }}>{i + 1}</span>
          {i < window.ETAPAS.length - 1 && <span style={{ width: 14, height: 1, background: 'var(--border-default)' }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function Admissoes() {
  const [aba, setAba] = React.useState('curso');
  const [confirmar, setConfirmar] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [aprovados, setAprovados] = React.useState([]);
  const rows = window.ADMISSOES.filter((a) => (aba === 'curso' ? !aprovados.includes(a.id) && a.sit[1] !== 'Aprovado' : aprovados.includes(a.id) || a.sit[1] === 'Aprovado'));
  return (
    <>
      <Topbar eyebrow="Fluxo de admissão" title="Admissões"
        actions={<Button size="sm" iconLeft="plus">Nova proposta</Button>} />
      <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-6)', position: 'relative' }}>
        <Card padding="0">
          <div style={{ padding: 'var(--space-4) var(--space-5) 0' }}>
            <Tabs value={aba} onChange={setAba} items={[{ value: 'curso', label: 'Em curso', count: window.ADMISSOES.length - 1 - aprovados.length }, { value: 'concluidas', label: 'Concluídas', count: 1 + aprovados.length }]} />
          </div>
          <div style={{ padding: 'var(--space-4) 0' }}>
            <DataTable rows={rows} empty="Nenhuma proposta nesta situação."
              columns={[
                { key: 'nome', label: 'Candidato', strong: true },
                { key: 'ordem', label: 'Ordem pretendida', render: (r) => <Tag order={r.ordem}>{window.ORDENS[r.ordem]}</Tag> },
                { key: 'origem', label: 'Loja de origem' },
                { key: 'entrada', label: 'Entrada', numeric: true },
                { key: 'etapa', label: 'Etapas', render: (r) => <Passos etapa={aprovados.includes(r.id) ? 4 : r.etapa} /> },
                { key: 'sit', label: 'Situação', render: (r) => aprovados.includes(r.id) ? <Badge tone="success" dot>Aprovado</Badge> : <Badge tone={r.sit[0]} dot>{r.sit[1]}</Badge> },
                { key: 'acoes', label: '', align: 'right', render: (r) => <RowActions>
                  {!aprovados.includes(r.id) && r.sit[1] !== 'Aprovado' && <Button size="sm" variant="secondary" onClick={() => setConfirmar(r)}>Aprovar</Button>}
                  <IconButton icon="paperclip" label="Documentos" size="sm" />
                </RowActions> },
              ]} />
          </div>
        </Card>
        <p style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-faint)', marginTop: 'var(--space-3)' }}>Etapas: {window.ETAPAS.map((e, i) => `${i + 1}. ${e}`).join(' · ')}</p>

        <Dialog open={Boolean(confirmar)} eyebrow={confirmar ? window.ORDENS[confirmar.ordem] : ''} title="Aprovar admissão?" width={460}
          description={confirmar ? `${confirmar.nome} será exaltado na próxima sessão do Capítulo.` : ''}
          onClose={() => setConfirmar(null)}
          footer={<><Button size="sm" variant="secondary" onClick={() => setConfirmar(null)}>Cancelar</Button>
            <Button size="sm" variant="accent" iconLeft="check" onClick={() => { setAprovados((a) => [...a, confirmar.id]); setToast(confirmar.nome); setConfirmar(null); }}>Aprovar admissão</Button></>}>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <Checkbox label="Documentação conferida pelo Escriba" checked />
            <Checkbox label="Taxa de admissão quitada" checked />
            <Checkbox label="Comunicar o candidato por e-mail" />
          </div>
        </Dialog>

        {toast && (
          <div style={{ position: 'absolute', right: 'var(--space-6)', bottom: 'var(--space-6)' }}>
            <Toast tone="success" title="Admissão aprovada" description={`${toast} consta como aprovado no exercício 2026.`} onClose={() => setToast(null)} />
          </div>
        )}
      </div>
    </>
  );
}
Object.assign(window, { Admissoes, Passos });