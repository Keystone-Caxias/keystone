'use client';
import React from 'react';
import { IconButton } from '../core/IconButton.jsx';

/** Centered modal over a scrim. */
export function Dialog({ open = true, title, eyebrow, description, children, footer, onClose, width = 480 }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'absolute', inset: 0, zIndex: 50,
        display: 'grid', placeItems: 'center',
        padding: 'var(--space-6)',
        background: 'rgba(20,19,17,.42)',
        backdropFilter: 'blur(2px)',
        animation: 'none',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width, maxWidth: '100%',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-4)',
          boxShadow: 'var(--shadow-3)',
          overflow: 'hidden',
        }}
      >
        <header style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-5) var(--space-3)' }}>
          <div style={{ display: 'grid', gap: 4, flex: 1 }}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h3 style={{ fontSize: 'var(--fs-xl)' }}>{title}</h3>}
            {description && <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{description}</p>}
          </div>
          {onClose && <IconButton icon="x" label="Fechar" size="sm" onClick={onClose} />}
        </header>
        {children && <div style={{ padding: '0 var(--space-5) var(--space-5)' }}>{children}</div>}
        {footer && (
          <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)' }}>
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
