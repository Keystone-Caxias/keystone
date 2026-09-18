'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/ds';

/** Botão do design system que navega para uma rota interna. */
export function LinkButton({ href, children, ...props }) {
  const router = useRouter();
  return (
    <Button {...props} onClick={() => router.push(href)}>
      {children}
    </Button>
  );
}
