import React from 'react';

/** Hover label for icon-only affordances. */
export function Tooltip({ label, children, placement = 'top', style }) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: { bottom: '100%', left: '50%', transform: 'translate(-50%, -6px)' },
    bottom: { top: '100%', left: '50%', transform: 'translate(-50%, 6px)' },
    left: { right: '100%', top: '50%', transform: 'translate(-6px, -50%)' },
    right: { left: '100%', top: '50%', transform: 'translate(6px, -50%)' },
  }[placement];
  return (
    <span style={{ position: 'relative', display: 'inline-flex', ...style }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <span
        role="tooltip"
        style={{
          position: 'absolute', ...pos, zIndex: 40,
          padding: '4px 8px',
          background: 'var(--surface-navy-deep)',
          color: 'var(--text-inverse)',
          fontSize: 'var(--fs-3xs)',
          letterSpacing: '0.01em',
          borderRadius: 'var(--radius-1)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: show ? 1 : 0,
          transition: `opacity var(--duration-fast) var(--ease-standard)`,
        }}
      >
        {label}
      </span>
    </span>
  );
}
