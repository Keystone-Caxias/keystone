import React from 'react';
import { Icon } from './Icon.jsx';

const orders = {
  'arco-real': ['var(--order-arco-real-bg)', 'var(--order-arco-real)'],
  marca: ['var(--order-marca-bg)', 'var(--gold-700)'],
  nautas: ['var(--order-nautas-bg)', 'var(--order-nautas)'],
};

/** Square label for orders, degrees and free classification. */
export function Tag({ children, order, onRemove, style, ...rest }) {
  const [bg, fg] = orders[order] || ['var(--surface-sunken)', 'var(--text-body)'];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 24,
        padding: onRemove ? '0 5px 0 9px' : '0 9px',
        borderRadius: 'var(--radius-1)',
        background: bg,
        color: fg,
        border: `1px solid color-mix(in oklab, ${fg} 22%, transparent)`,
        fontSize: 'var(--fs-2xs)',
        fontWeight: 'var(--fw-medium)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {order && <span style={{ width: 5, height: 5, background: fg, transform: 'rotate(45deg)' }} />}
      {children}
      {onRemove && (
        <button type="button" aria-label="Remover" onClick={onRemove} style={{ display: 'inline-flex', border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer', padding: 2, opacity: 0.7 }}>
          <Icon name="x" size={11} />
        </button>
      )}
    </span>
  );
}
