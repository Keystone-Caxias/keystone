import React from 'react';
import { Icon } from '../core/Icon.jsx';

/** Text field with label, hint and error. */
export function Input({ label, hint, error, iconLeft, suffix, required, id, style, wrapperStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || React.useId();
  const invalid = Boolean(error);
  return (
    <div style={{ display: 'grid', gap: 6, ...wrapperStyle }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 'var(--fs-2xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', letterSpacing: '0.02em' }}>
          {label}
          {required && <span style={{ color: 'var(--status-danger-fg)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: 36,
          padding: '0 10px',
          background: rest.disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: `1px solid ${invalid ? 'var(--status-danger-fg)' : focus ? 'var(--border-focus)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-2)',
          boxShadow: focus ? 'var(--focus-ring)' : 'none',
          transition: 'var(--transition-base)',
        }}
      >
        {iconLeft && <Icon name={iconLeft} size={15} color="var(--text-faint)" />}
        <input
          id={inputId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', font: 'inherit', fontSize: 'var(--fs-sm)', color: 'var(--text-strong)', ...style }}
          {...rest}
        />
        {suffix && <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-faint)' }}>{suffix}</span>}
      </div>
      {(hint || error) && (
        <span style={{ fontSize: 'var(--fs-2xs)', color: invalid ? 'var(--status-danger-fg)' : 'var(--text-muted)' }}>{error || hint}</span>
      )}
    </div>
  );
}
