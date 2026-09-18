'use client';
import { useState } from 'react';

/** Glifo de fallback (chave de abóbada simplificada) usado quando /keystone.jpg não existe. */
function KeystoneGlifo({ size, style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" style={{ display: 'block', ...style }} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M24 26h52l12 52H12z" />
      <path d="M34 42h32M38 56h24M42 70h16" />
    </svg>
  );
}

/**
 * Emblema da chave de abóbada. Usa /keystone.jpg (invertido, em blend screen) quando o
 * arquivo existe em public/, e cai para um glifo SVG quando não existe.
 */
export function Emblema({ size = 26, style }) {
  const [falhou, setFalhou] = useState(false);
  if (falhou) return <KeystoneGlifo size={size} style={{ color: 'var(--neutral-0)', ...style }} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- imagem estática opcional, sem otimização
    <img
      src="/keystone.jpg"
      alt=""
      onError={() => setFalhou(true)}
      style={{ width: size, height: 'auto', filter: 'invert(1)', mixBlendMode: 'screen', display: 'block', ...style }}
    />
  );
}

/** Marca-d'água grande (6–8% de opacidade) para fundos navy. */
export function MarcaDagua({ style }) {
  const [falhou, setFalhou] = useState(false);
  if (falhou) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- imagem estática opcional, sem otimização
    <img src="/keystone.jpg" alt="" onError={() => setFalhou(true)} style={{ position: 'absolute', filter: 'invert(1)', mixBlendMode: 'screen', pointerEvents: 'none', ...style }} />
  );
}
