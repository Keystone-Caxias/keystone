'use client';
import { Button, Card } from '@/ds';

export default function Erro({ error, reset }) {
  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <Card eyebrow="Erro" title="Não foi possível carregar esta tela" style={{ maxWidth: 'var(--width-form-max)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <p style={{ color: 'var(--text-body)' }}>{error?.message || 'Erro desconhecido.'}</p>
          <div>
            <Button size="sm" variant="secondary" onClick={() => reset()}>Tentar de novo</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
