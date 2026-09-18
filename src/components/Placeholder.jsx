import { Icon } from '@/ds';

/** Estado factual para telas sem especificação recebida. */
export function Placeholder({ label = 'Sem especificação recebida' }) {
  return (
    <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--text-faint)', fontSize: 'var(--fs-sm)' }}>
      <div style={{ textAlign: 'center', display: 'grid', gap: 6, justifyItems: 'center' }}>
        <Icon name="square-dashed" size={22} />
        <span>{label}. Tela ainda não especificada.</span>
      </div>
    </div>
  );
}
