'use client';
import React from 'react';
import { Icon } from '../core/Icon.jsx';

/** Registry table: hairline rows, tabular figures, uppercase head. */
export function DataTable({ columns = [], rows = [], onRowClick, selectedId, empty = 'Nenhum registro.', style, ...rest }) {
  const [hover, setHover] = React.useState(null);
  return (
    <div style={{ overflowX: 'auto', ...style }} {...rest}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align || 'left',
                  padding: '0 var(--space-4) 8px',
                  fontSize: 'var(--fs-3xs)',
                  fontWeight: 'var(--fw-semibold)',
                  letterSpacing: 'var(--ls-caps)',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  borderBottom: '1px solid var(--border-default)',
                  whiteSpace: 'nowrap',
                  width: c.width,
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-faint)' }}>{empty}</td></tr>
          )}
          {rows.map((row, i) => {
            const id = row.id ?? i;
            const isSel = selectedId != null && selectedId === id;
            return (
              <tr
                key={id}
                onMouseEnter={() => setHover(id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onRowClick && onRowClick(row)}
                style={{
                  background: isSel ? 'var(--surface-selected)' : hover === id ? 'var(--surface-hover)' : 'transparent',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: `background var(--duration-instant) linear`,
                }}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={c.numeric ? 'numeric' : undefined}
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      textAlign: c.align || 'left',
                      borderBottom: '1px solid var(--border-subtle)',
                      color: c.strong ? 'var(--text-strong)' : 'var(--text-body)',
                      fontWeight: c.strong ? 'var(--fw-medium)' : 'var(--fw-regular)',
                      whiteSpace: c.wrap ? 'normal' : 'nowrap',
                    }}
                  >
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Right-aligned row affordance cluster. */
export function RowActions({ children }) {
  return <span style={{ display: 'inline-flex', gap: 2, justifyContent: 'flex-end' }}>{children}</span>;
}

/** Inline "sorted by" marker for a column header. */
export function SortMark({ dir = 'asc' }) {
  return <Icon name={dir === 'asc' ? 'chevron-up' : 'chevron-down'} size={12} style={{ marginLeft: 4, verticalAlign: 'middle' }} />;
}
