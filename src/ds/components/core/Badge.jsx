'use client';
import React from 'react';
import { Icon } from './Icon.jsx';

const tones = {
  neutral: ['var(--status-neutral-bg)', 'var(--status-neutral-fg)'],
  success: ['var(--status-success-bg)', 'var(--status-success-fg)'],
  warning: ['var(--status-warning-bg)', 'var(--status-warning-fg)'],
  danger: ['var(--status-danger-bg)', 'var(--status-danger-fg)'],
  info: ['var(--status-info-bg)', 'var(--status-info-fg)'],
};

/** Status pill. */
export function Badge({ children, tone = 'neutral', icon, dot, style, ...rest }) {
  const [bg, fg] = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height: 22,
        padding: '0 9px',
        borderRadius: 'var(--radius-pill)',
        background: bg,
        color: fg,
        fontSize: 'var(--fs-3xs)',
        fontWeight: 'var(--fw-semibold)',
        letterSpacing: 'var(--ls-wide)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: fg }} />}
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
}
