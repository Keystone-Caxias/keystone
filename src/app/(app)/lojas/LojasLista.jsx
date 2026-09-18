'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, DataTable, IconButton, RowActions, Toast, Tooltip } from '@/ds';

const MENSAGENS = {
  criada: ['Loja cadastrada', 'A loja consta no registro.'],
  atualizada: ['Loja atualizada', 'As alterações foram gravadas.'],
  excluida: ['Loja excluída', 'O registro foi removido.'],
};

export function LojasLista({ lojas, porLoja, mensagem }) {
  const router = useRouter();
  const [toast, setToast] = useState(MENSAGENS[mensagem] || null);
  return (
    <div style={{ position: 'relative' }}>
      <Card padding="0">
        <div style={{ padding: 'var(--space-4) 0' }}>
          <DataTable rows={lojas} onRowClick={(r) => router.push(`/lojas/${r.id}/editar`)} empty="Nenhuma loja cadastrada."
            columns={[
              { key: 'nome', label: 'Loja', strong: true },
              { key: 'potencia_simbolica', label: 'Potência' },
              { key: 'endereco', label: 'Endereço', wrap: true, render: (r) => r.endereco || '—' },
              { key: 'membros', label: 'Irmãos', numeric: true, align: 'right', render: (r) => porLoja[r.id] ?? 0 },
              { key: 'acoes', label: '', align: 'right', render: (r) => (
                <RowActions>
                  <Tooltip label="Editar"><IconButton icon="pencil" label="Editar" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/lojas/${r.id}/editar`); }} /></Tooltip>
                </RowActions>
              ) },
            ]} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)' }}>
          <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{lojas.length} {lojas.length === 1 ? 'loja' : 'lojas'}</span>
        </div>
      </Card>
      {toast && (
        <div style={{ position: 'fixed', right: 'var(--space-6)', bottom: 'var(--space-6)', zIndex: 40 }}>
          <Toast tone="success" title={toast[0]} description={toast[1]} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}
