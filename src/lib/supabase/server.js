import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseKey, supabaseUrl } from './env';

export { configurado } from './env';

/** Cliente Supabase para Server Components, Server Actions e Route Handlers. */
export async function createClient() {
  // cookies() vem primeiro: além de ler a sessão, marca a rota como dinâmica,
  // para o build da Vercel não tentar pré-renderizar telas que dependem de login.
  const cookieStore = await cookies();
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY (veja .env.example).');
  }
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chamado a partir de um Server Component: não pode gravar cookies.
          // O proxy (src/proxy.js) renova a sessão a cada requisição, então é seguro ignorar.
        }
      },
    },
  });
}
