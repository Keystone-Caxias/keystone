'use client';
import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';

const tones = {
  success: ['var(--status-success-fg)', 'circle-check'],
  danger: ['var(--status-danger-fg)', 'circle-alert'],
  warning: ['var(--status-warning-fg)', 'triangle-alert'],
  info: ['var(--status-info-fg)', 'info'],
};

/** Transient confirmation notice. */
export function Toast({ tone = 'success', title, description, onClose, style, ...rest }) {
  const [fg, icon] = tones[tone] || tones.info;
  return (
    <div
      role="status"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        width: 340, padding: 'var(--space-3) var(--space-4)',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderLeft: `3px solid ${fg}`,
        borderRadius: 'var(--radius-2)',
        boxShadow: 'var(--shadow-2)',
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={16} color={fg} style={{ marginTop: 1 }} />
      <div style={{ display: 'grid', gap: 2, flex: 1 }}>
        {title && <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{title}</span>}
        {description && <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{description}</span>}
      </div>
      {onClose && <IconButton icon="x" label="Dispensar" size="sm" onClick={onClose} />}
    </div>
  );
}
