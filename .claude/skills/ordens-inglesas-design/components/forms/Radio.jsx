import React from 'react';

/** Single radio row. */
export function Radio({ label, hint, checked, name, value, onChange, disabled, id, ...rest }) {
  const radioId = id || React.useId();
  return (
    <label htmlFor={radioId} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1 }}>
      <input id={radioId} type="radio" name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} {...rest} />
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 17, height: 17, marginTop: 1, flex: '0 0 auto', borderRadius: '50%',
          border: `1px solid ${checked ? 'var(--action-primary-bg)' : 'var(--border-loud)'}`,
          background: 'var(--surface-card)',
          transition: 'var(--transition-base)',
        }}
      >
        {checked && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--action-primary-bg)' }} />}
      </span>
      {(label || hint) && (
        <span style={{ display: 'grid', gap: 2 }}>
          {label && <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-strong)' }}>{label}</span>}
          {hint && <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{hint}</span>}
        </span>
      )}
    </label>
  );
}
