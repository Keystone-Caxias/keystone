import React from 'react';
import { Icon } from './Icon.jsx';

const sizes = {
  sm: { height: 30, padding: '0 10px', fontSize: 'var(--fs-2xs)', gap: 6, icon: 14 },
  md: { height: 36, padding: '0 14px', fontSize: 'var(--fs-sm)', gap: 8, icon: 16 },
  lg: { height: 44, padding: '0 20px', fontSize: 'var(--fs-md)', gap: 10, icon: 18 },
};

const variants = {
  primary: { background: 'var(--action-primary-bg)', color: 'var(--action-primary-fg)', border: '1px solid var(--action-primary-bg)', hover: 'var(--action-primary-bg-hover)' },
  accent: { background: 'var(--action-accent-bg)', color: 'var(--action-accent-fg)', border: '1px solid var(--action-accent-bg)', hover: 'var(--action-accent-bg-hover)' },
  secondary: { background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-loud)', hover: 'var(--surface-hover)' },
  ghost: { background: 'transparent', color: 'var(--action-ghost-fg)', border: '1px solid transparent', hover: 'var(--surface-hover)' },
  danger: { background: 'var(--surface-card)', color: 'var(--status-danger-fg)', border: '1px solid color-mix(in oklab, var(--status-danger-fg) 35%, transparent)', hover: 'var(--status-danger-bg)' },
};

/** Primary action control. */
export function Button({ children, variant = 'primary', size = 'md', iconLeft, iconRight, disabled, fullWidth, type = 'button', style, ...rest }) {
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        fontFamily: 'var(--font-body)',
        fontSize: s.fontSize,
        fontWeight: 'var(--fw-medium)',
        letterSpacing: '0.01em',
        borderRadius: 'var(--radius-2)',
        border: v.border,
        background: disabled ? 'var(--action-disabled-bg)' : hover ? v.hover : v.background,
        color: disabled ? 'var(--action-disabled-fg)' : v.color,
        borderColor: disabled ? 'var(--border-default)' : undefined,
        boxShadow: variant === 'ghost' || disabled ? 'none' : active ? 'none' : 'var(--shadow-1)',
        transform: active && !disabled ? 'translateY(1px)' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-base)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {iconLeft && <Icon name={iconLeft} size={s.icon} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.icon} />}
    </button>
  );
}
