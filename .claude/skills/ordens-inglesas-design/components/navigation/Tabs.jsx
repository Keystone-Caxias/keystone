import React from 'react';
import { Icon } from '../core/Icon.jsx';

/** Underlined tab strip. */
export function Tabs({ items = [], value, onChange, style, ...rest }) {
  const active = value ?? (items[0] && (items[0].value ?? items[0]));
  return (
    <div role="tablist" style={{ display: 'flex', gap: 'var(--space-5)', borderBottom: '1px solid var(--border-default)', ...style }} {...rest}>
      {items.map((raw) => {
        const item = typeof raw === 'string' ? { value: raw, label: raw } : raw;
        const isActive = item.value === active;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange && onChange(item.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              border: 0, background: 'transparent', cursor: 'pointer',
              padding: '0 0 10px',
              marginBottom: -1,
              borderBottom: `2px solid ${isActive ? 'var(--order-arco-real)' : 'transparent'}`,
              color: isActive ? 'var(--text-strong)' : 'var(--text-muted)',
              font: 'inherit',
              fontSize: 'var(--fs-sm)',
              fontWeight: isActive ? 'var(--fw-semibold)' : 'var(--fw-regular)',
              transition: 'var(--transition-base)',
            }}
          >
            {item.icon && <Icon name={item.icon} size={15} />}
            {item.label}
            {item.count != null && (
              <span className="numeric" style={{ fontSize: 'var(--fs-3xs)', color: 'var(--text-faint)' }}>{item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
