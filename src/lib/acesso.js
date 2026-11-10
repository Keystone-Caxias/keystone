// Controle de acesso: ter sessão não basta, a conta precisa constar na tabela `oficial`
// (migration 004). O banco aplica a regra por RLS; aqui ficam a leitura do papel para as
// telas e as guardas das Server Actions.
import { PAPEIS } from './formatar';

/** { user, papel } de quem está na sessão; `papel` é null para conta sem autorização. */
export async function obterAcesso(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, papel: null };
  const { data, error } = await supabase.rpc('papel_atual');
  if (error) throw new Error(`Falha ao verificar o acesso: ${error.message}`);
  return { user, papel: Object.hasOwn(PAPEIS, data) ? data : null };
}

/**
 * Guarda de gravação para Server Actions: devolve a mensagem de recusa ou null.
 * Necessária porque, com RLS, UPDATE e DELETE de quem não pode gravar não dão erro:
 * apenas não alteram nenhuma linha.
 */
export async function recusaDeGravacao(supabase, { administrador = false } = {}) {
  const { user, papel } = await obterAcesso(supabase);
  if (!user) return 'Sessão encerrada. Entre novamente na plataforma.';
  if (!papel) return 'Esta conta não está autorizada a usar a plataforma.';
  if (administrador && papel !== 'administrador') return 'Somente administradores podem fazer esta alteração.';
  if (papel === 'leitura') return 'Seu perfil é somente leitura: não é possível gravar alterações.';
  return null;
}
