import React from 'react';
import { Icon } from '../core/Icon.jsx';

/** Square checkbox with inline label. */
export function Checkbox({ label, hint, checked, onChange, disabled, id, ...rest }) {
  const boxId = id || React.useId();
  return (
    <label htmlFor={boxId} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1 }}>
      <input id={boxId} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} {...rest} />
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 17, height: 17, marginTop: 1, flex: '0 0 auto',
          borderRadius: 'var(--radius-1)',
          border: `1px solid ${checked ? 'var(--action-primary-bg)' : 'var(--border-loud)'}`,
          background: checked ? 'var(--action-primary-bg)' : 'var(--surface-card)',
          color: 'var(--action-primary-fg)',
          transition: 'var(--transition-base)',
        }}
      >
        {checked && <Icon name="check" size={12} />}
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
