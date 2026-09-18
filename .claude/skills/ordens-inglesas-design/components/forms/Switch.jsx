import React from 'react';

/** Immediate on/off toggle. */
export function Switch({ label, hint, checked, onChange, disabled, id, ...rest }) {
  const switchId = id || React.useId();
  return (
    <label htmlFor={switchId} style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1 }}>
      <input id={switchId} type="checkbox" role="switch" checked={checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} {...rest} />
      <span
        aria-hidden="true"
        style={{
          position: 'relative', width: 34, height: 19, flex: '0 0 auto',
          borderRadius: 'var(--radius-pill)',
          background: checked ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
          transition: `background var(--duration-fast) var(--ease-standard)`,
        }}
      >
        <span style={{ position: 'absolute', top: 2, left: checked ? 17 : 2, width: 15, height: 15, borderRadius: '50%', background: 'var(--neutral-0)', boxShadow: 'var(--shadow-1)', transition: `left var(--duration-fast) var(--ease-standard)` }} />
      </span>
      {(label || hint) && (
        <span style={{ display: 'grid', gap: 1 }}>
          {label && <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-strong)' }}>{label}</span>}
          {hint && <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{hint}</span>}
        </span>
      )}
    </label>
  );
}
