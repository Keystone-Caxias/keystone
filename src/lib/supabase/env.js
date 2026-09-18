export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** true quando as duas variáveis públicas do Supabase estão definidas. */
export function configurado() {
  return Boolean(supabaseUrl && supabaseKey);
}
