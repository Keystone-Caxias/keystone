'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function destinoSeguro(valor) {
  const s = typeof valor === 'string' ? valor : '';
  return s.startsWith('/') && !s.startsWith('//') ? s : '/';
}

/** Autentica com e-mail e senha no Supabase Auth. Usado via useActionState. */
export async function entrar(prevState, formData) {
  const email = String(formData.get('email') || '').trim();
  const senha = String(formData.get('senha') || '');
  const next = destinoSeguro(formData.get('next'));
  if (!email || !senha) return { erro: 'Informe e-mail e senha.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) return { erro: 'E-mail ou senha não conferem.' };
  redirect(next);
}

/** Encerra a sessão e volta para o login. */
export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
