/** Cartão de métrica: versalete, número grande em mono tabular e legenda. */
export function Metric({ eyebrow, value, unit, hint, tone }) {
  return (
    <div style={{ background: 'var(--surface-card)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-3)', boxShadow: 'var(--shadow-1)', padding: 'var(--space-4) var(--space-5)', display: 'grid', gap: 6 }}>
      <span className="eyebrow">{eyebrow}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {unit && <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{unit}</span>}
        <span className="numeric" style={{ fontSize: 'var(--fs-3xl)', color: 'var(--text-strong)', lineHeight: 1 }}>{value}</span>
      </div>
      {hint && <span style={{ fontSize: 'var(--fs-2xs)', color: tone ? `var(--status-${tone}-fg)` : 'var(--text-muted)' }}>{hint}</span>}
    </div>
  );
}
