import React from 'react';
import { Icon } from './Icon.jsx';

const sizes = { sm: { box: 28, icon: 14 }, md: { box: 34, icon: 16 }, lg: { box: 40, icon: 20 } };

/** Square icon-only action; always labelled. */
export function IconButton({ icon, label, size = 'md', variant = 'ghost', disabled, style, ...rest }) {
  const s = sizes[size] || sizes.md;
  const [hover, setHover] = React.useState(false);
  const solid = variant === 'solid';
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: s.box,
        height: s.box,
        borderRadius: 'var(--radius-2)',
        border: variant === 'outline' ? '1px solid var(--border-loud)' : '1px solid transparent',
        background: disabled ? 'transparent' : solid ? (hover ? 'var(--action-primary-bg-hover)' : 'var(--action-primary-bg)') : hover ? 'var(--surface-hover)' : 'transparent',
        color: disabled ? 'var(--action-disabled-fg)' : solid ? 'var(--action-primary-fg)' : 'var(--text-body)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-base)',
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={s.icon} />
    </button>
  );
}
