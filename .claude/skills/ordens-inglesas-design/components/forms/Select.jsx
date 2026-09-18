import React from 'react';
import { Icon } from '../core/Icon.jsx';

/** Native select in system dress. */
export function Select({ label, hint, error, options = [], placeholder, required, id, style, wrapperStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const selectId = id || React.useId();
  const invalid = Boolean(error);
  return (
    <div style={{ display: 'grid', gap: 6, ...wrapperStyle }}>
      {label && (
        <label htmlFor={selectId} style={{ fontSize: 'var(--fs-2xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', letterSpacing: '0.02em' }}>
          {label}
          {required && <span style={{ color: 'var(--status-danger-fg)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <select
          id={selectId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            appearance: 'none',
            width: '100%',
            height: 36,
            padding: '0 32px 0 10px',
            background: rest.disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
            border: `1px solid ${invalid ? 'var(--status-danger-fg)' : focus ? 'var(--border-focus)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-2)',
            boxShadow: focus ? 'var(--focus-ring)' : 'none',
            font: 'inherit',
            fontSize: 'var(--fs-sm)',
            color: 'var(--text-strong)',
            transition: 'var(--transition-base)',
            ...style,
          }}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => {
            const value = typeof o === 'string' ? o : o.value;
            const text = typeof o === 'string' ? o : o.label;
            return <option key={value} value={value}>{text}</option>;
          })}
        </select>
        <Icon name="chevron-down" size={15} color="var(--text-muted)" style={{ position: 'absolute', right: 10, pointerEvents: 'none' }} />
      </div>
      {(hint || error) && <span style={{ fontSize: 'var(--fs-2xs)', color: invalid ? 'var(--status-danger-fg)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </div>
  );
}
