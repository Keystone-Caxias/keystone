import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const ROTAS_PUBLICAS = ['/login'];

/** Renova a sessão do Supabase a cada requisição e protege as rotas internas. */
export async function proxy(request) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response; // sem configuração, as páginas mostram o aviso de ambiente

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() valida o token no servidor do Supabase; não use getSession() aqui.
  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;
  const publica = ROTAS_PUBLICAS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!user && !publica) {
    const destino = request.nextUrl.clone();
    destino.pathname = '/login';
    destino.search = '';
    if (pathname !== '/') destino.searchParams.set('next', pathname);
    return NextResponse.redirect(destino);
  }
  if (user && pathname === '/login') {
    const destino = request.nextUrl.clone();
    destino.pathname = '/';
    destino.search = '';
    return NextResponse.redirect(destino);
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|icon.svg|favicon.ico|keystone.jpg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)$).*)'],
};
