'use client';
import React from 'react';

/** Bordered paper surface. */
export function Card({ children, title, eyebrow, actions, padding = 'var(--space-5)', accent, style, ...rest }) {
  const accents = {
    'arco-real': 'var(--order-arco-real)',
    marca: 'var(--order-marca)',
    nautas: 'var(--order-nautas)',
  };
  return (
    <section
      style={{
        background: 'var(--surface-card)',
        border: 'var(--border-hairline)',
        borderRadius: 'var(--radius-3)',
        boxShadow: 'var(--shadow-1)',
        borderTop: accent ? `2px solid ${accents[accent] || accent}` : undefined,
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      {(title || eyebrow || actions) && (
        <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)', padding: `var(--space-4) ${padding} var(--space-3)`, borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'grid', gap: 2 }}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h4 style={{ fontSize: 'var(--fs-lg)' }}>{title}</h4>}
          </div>
          {actions && <div style={{ display: 'flex', gap: 'var(--space-2)' }}>{actions}</div>}
        </header>
      )}
      <div style={{ padding }}>{children}</div>
    </section>
  );
}
