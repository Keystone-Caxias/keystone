import { redirect } from 'next/navigation';
import { ConfiguracaoPendente } from '@/components/ConfiguracaoPendente';
import { Shell } from '@/components/Shell';
import { configurado, createClient } from '@/lib/supabase/server';

// Toda a área interna depende da sessão: nunca pré-renderizar no build.
export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }) {
  if (!configurado()) return <ConfiguracaoPendente />;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return <Shell user={user}>{children}</Shell>;
}
