'use client';
import { useRouter } from 'next/navigation';
import { DataTable, Tag } from '@/ds';
import { ORDENS, formatarCpf, formatarDataHora } from '@/lib/formatar';

export function PainelRecentes({ rows }) {
  const router = useRouter();
  return (
    <DataTable
      rows={rows}
      onRowClick={(r) => router.push(`/cadastro/${r.id}/editar`)}
      empty="Nenhum irmão cadastrado ainda."
      columns={[
        { key: 'nome', label: 'Irmão', strong: true },
        { key: 'cpf', label: 'CPF', numeric: true, render: (r) => formatarCpf(r.cpf) },
        { key: 'loja', label: 'Loja', render: (r) => r.loja?.nome ?? '—' },
        { key: 'ordens', label: 'Ordens', render: (r) => (
          <span style={{ display: 'inline-flex', gap: 6 }}>
            {r.ordens.length === 0 ? <span style={{ color: 'var(--text-faint)' }}>—</span> : r.ordens.map((o) => <Tag key={o} order={o}>{ORDENS[o]}</Tag>)}
          </span>
        ) },
        { key: 'created_at', label: 'Cadastrado em', numeric: true, align: 'right', render: (r) => formatarDataHora(r.created_at) },
      ]}
    />
  );
}
