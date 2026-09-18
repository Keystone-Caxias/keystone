/** Área rolável abaixo da Topbar, com padding 24 e largura máxima do sistema. */
export function Conteudo({ children, style }) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--space-6)' }}>
      <div style={{ maxWidth: 'var(--width-content-max)', display: 'grid', gap: 'var(--space-6)', alignContent: 'start', ...style }}>{children}</div>
    </div>
  );
}
