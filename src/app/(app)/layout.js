import { redirect } from 'next/navigation';
import { AcessoPendente } from '@/components/AcessoPendente';
import { ConfiguracaoPendente } from '@/components/ConfiguracaoPendente';
import { Shell } from '@/components/Shell';
import { obterAcesso } from '@/lib/acesso';
import { configurado, createClient } from '@/lib/supabase/server';

// Toda a área interna depende da sessão: nunca pré-renderizar no build.
export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }) {
  if (!configurado()) return <ConfiguracaoPendente />;
  const supabase = await createClient();
  const { user, papel } = await obterAcesso(supabase);
  if (!user) redirect('/login');
  if (!papel) {
    const { data: haOficiais } = await supabase.rpc('existe_oficial');
    return <AcessoPendente email={user.email} haOficiais={haOficiais !== false} />;
  }
  return <Shell user={user} papel={papel}>{children}</Shell>;
}
