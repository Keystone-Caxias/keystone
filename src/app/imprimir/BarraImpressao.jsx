'use client';
import { useRouter } from 'next/navigation';
import { Button, Tabs } from '@/ds';

/**
 * Barra fixa no topo da área de impressão. Não sai no papel (classe `nao-imprimir`).
 * `opcoes` ([{ valor, label, href }]) mostra variações do mesmo documento como abas.
 */
export function BarraImpressao({ voltar, eyebrow, titulo, opcoes, atual, podeImprimir = true }) {
  const router = useRouter();
  return (
    <div className="nao-imprimir" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--surface-card)', borderBottom: '1px solid var(--border-default)' }}>
      <div style={{ minHeight: 'var(--height-topbar)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: '0 var(--space-6)' }}>
        <Button size="sm" variant="secondary" iconLeft="chevron-left" onClick={() => router.push(voltar)}>Voltar</Button>
        <div style={{ flex: 1, minWidth: 0, display: 'grid', gap: 1 }}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h3 style={{ fontSize: 'var(--fs-xl)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{titulo}</h3>
        </div>
        <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>Para gerar PDF, escolha a opção de salvar como PDF na janela de impressão.</span>
        <Button size="sm" iconLeft="printer" disabled={!podeImprimir} onClick={() => window.print()}>Imprimir</Button>
      </div>
      {opcoes && opcoes.length > 0 && (
        <div style={{ padding: '0 var(--space-6)' }}>
          <Tabs value={atual} items={opcoes.map((o) => ({ value: o.valor, label: o.label }))} style={{ borderBottom: 0 }}
            onChange={(v) => { const o = opcoes.find((x) => x.valor === v); if (o) router.replace(o.href); }} />
        </div>
      )}
    </div>
  );
}
