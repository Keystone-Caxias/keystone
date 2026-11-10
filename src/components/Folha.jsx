import { formatarDataHora } from '@/lib/formatar';

const CORES = {
  'arco-real': 'var(--order-arco-real)',
  marca: 'var(--order-marca)',
  nautas: 'var(--order-nautas)',
};

/**
 * Folha A4 da área de impressão (`/imprimir`): régua superior na cor da Ordem, assinatura
 * tipográfica, título do documento e rodapé de emissão. Cada Folha sai em página nova.
 * `emissao` = { quando: ISO, quem: e-mail do oficial }.
 */
export function Folha({ eyebrow, titulo, subtitulo, ordem, emissao, children }) {
  return (
    <article className="folha" style={{ color: 'var(--text-body)' }}>
      <header style={{ borderTop: `2px solid ${CORES[ordem] || 'var(--surface-navy)'}`, paddingTop: 12, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--text-strong)' }}>Ordens Inglesas</span>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        </div>
        <h1 style={{ fontSize: 26, lineHeight: 1.12, marginTop: 10 }}>{titulo}</h1>
        {subtitulo && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{subtitulo}</p>}
        <div style={{ borderTop: 'var(--rule-ornament)', width: 96, marginTop: 12 }} />
      </header>
      <div style={{ flex: 1, display: 'grid', gap: 18, alignContent: 'start' }}>{children}</div>
      {emissao && (
        <footer className="numeric" style={{ marginTop: 22, paddingTop: 8, borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 9.5, color: 'var(--text-muted)' }}>
          <span>Emitido em {formatarDataHora(emissao.quando)}{emissao.quem ? ` por ${emissao.quem}` : ''}</span>
          <span>Ordens Inglesas · controle interno</span>
        </footer>
      )}
    </article>
  );
}

/** Seção de documento: título em display com filete; não se parte entre páginas. */
export function Secao({ titulo, children }) {
  return (
    <section className="nao-quebrar" style={{ display: 'grid', gap: 10 }}>
      <h2 style={{ fontSize: 15, paddingBottom: 4, borderBottom: '1px solid var(--border-default)' }}>{titulo}</h2>
      {children}
    </section>
  );
}

/** Aviso factual dentro de uma folha (documento sem dados ou parâmetro ausente). */
export function Aviso({ children }) {
  return <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{children}</p>;
}

// Tabelas dos documentos impressos: mesmas regras do DataTable (cabeçalho em versalete,
// filetes de 1px, sem zebra), em corpo menor para caber no A4.
export const th = { padding: '0 8px 6px 0', textAlign: 'left', fontSize: 8.5, fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-loud)', whiteSpace: 'nowrap' };
export const td = { padding: '6px 8px 6px 0', fontSize: 11.5, lineHeight: '15px', color: 'var(--text-body)', borderBottom: '1px solid var(--border-default)', verticalAlign: 'top' };
export const direita = { textAlign: 'right', paddingRight: 0, paddingLeft: 8 };
