import { redirect } from 'next/navigation';
import { ConfiguracaoPendente } from '@/components/ConfiguracaoPendente';
import { obterAcesso } from '@/lib/acesso';
import { configurado, createClient } from '@/lib/supabase/server';
import './imprimir.css';

// Documentos dependem da sessão e dos dados do momento: nunca pré-renderizar.
export const dynamic = 'force-dynamic';

/** Área de impressão: mesma exigência de sessão da área interna, sem o Shell (menu e topbar). */
export default async function ImprimirLayout({ children }) {
  if (!configurado()) return <ConfiguracaoPendente />;
  const supabase = await createClient();
  const { user, papel } = await obterAcesso(supabase);
  if (!user) redirect('/login');
  if (!papel) redirect('/'); // a área interna mostra a tela "Acesso pendente"
  return <div className="area-impressao">{children}</div>;
}
