'use server';
import { revalidatePath } from 'next/cache';
import { obterAcesso, recusaDeGravacao } from '@/lib/acesso';
import { ORDEM_DB, PAPEIS, TIPOS_LANCAMENTO, dataValida, hojeISO, lerOrdem } from '@/lib/formatar';
import { createClient } from '@/lib/supabase/server';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const texto = (fd, k) => {
  const v = fd.get(k);
  const s = v == null ? '' : String(v).trim();
  return s === '' ? null : s;
};

function traduzirErro(error) {
  if (error.code === '23505') return 'Já existe uma categoria deste tipo com esse nome.';
  if (error.code === '23503') return 'A categoria já foi usada em lançamentos e não pode ser excluída. Ela pode ser renomeada.';
  if (error.code === '42501') return 'Sem permissão para gravar. Entre novamente na plataforma.';
  return `Não foi possível salvar. ${error.message}`;
}

function revalidar() {
  revalidatePath('/ajustes');
  revalidatePath('/tesouraria');
}

/** Cria uma categoria (nome + tipo) ou renomeia uma existente (id + nome). Devolve { erro } ou { ok }. */
export async function salvarCategoria(formData) {
  const id = texto(formData, 'id');
  const nome = texto(formData, 'nome');
  const tipo = texto(formData, 'tipo');
  if (!nome) return { erro: 'Informe o nome da categoria.' };
  if (nome.length > 60) return { erro: 'O nome deve ter no máximo 60 caracteres.' };

  const supabase = await createClient();
  const recusa = await recusaDeGravacao(supabase);
  if (recusa) return { erro: recusa };
  if (id) {
    if (!UUID.test(id)) return { erro: 'Categoria não identificada.' };
    const { data, error } = await supabase.from('categoria_caixa').update({ nome }).eq('id', id).select('id');
    if (error) return { erro: traduzirErro(error) };
    if (!data || data.length === 0) return { erro: 'Categoria não encontrada. Ela pode ter sido excluída por outro oficial.' };
  } else {
    if (!tipo || !Object.hasOwn(TIPOS_LANCAMENTO, tipo)) return { erro: 'Informe se a categoria é de entrada ou de saída.' };
    const { error } = await supabase.from('categoria_caixa').insert({ nome, tipo });
    if (error) return { erro: traduzirErro(error) };
  }
  revalidar();
  return { ok: true };
}

/** Exclui uma categoria que ainda não foi usada em lançamentos. Devolve { erro } ou { ok }. */
export async function excluirCategoria(formData) {
  const id = texto(formData, 'id');
  if (!id || !UUID.test(id)) return { erro: 'Categoria não identificada.' };
  const supabase = await createClient();
  const recusa = await recusaDeGravacao(supabase);
  if (recusa) return { erro: recusa };
  const { error } = await supabase.from('categoria_caixa').delete().eq('id', id);
  if (error) return { erro: traduzirErro(error) };
  revalidar();
  return { ok: true };
}

// ---------- oficiais e acesso ----------

function traduzirErroOficial(error) {
  if (error.code === 'KS002') return 'Não há conta com este e-mail. Crie a conta primeiro no painel do Supabase (Authentication → Users → Add user) e depois autorize aqui.';
  if (error.code === 'KS003') return 'É preciso manter ao menos um administrador. Promova outro oficial antes.';
  if (error.code === '42501') return 'Somente administradores podem alterar os oficiais.';
  return `Não foi possível salvar. ${error.message}`;
}

/** Autoriza uma conta existente (e-mail + papel) ou troca o papel de um oficial. Devolve { erro } ou { ok }. */
export async function definirOficial(formData) {
  const email = (texto(formData, 'email') || '').toLowerCase();
  const papel = texto(formData, 'papel');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { erro: 'Informe o e-mail da conta.' };
  if (!papel || !Object.hasOwn(PAPEIS, papel)) return { erro: 'Escolha o papel.' };
  const supabase = await createClient();
  const recusa = await recusaDeGravacao(supabase, { administrador: true });
  if (recusa) return { erro: recusa };
  const { error } = await supabase.rpc('oficial_definir', { p_email: email, p_papel: papel });
  if (error) return { erro: traduzirErroOficial(error) };
  revalidatePath('/', 'layout');
  return { ok: true };
}

/** Retira o acesso de um oficial (a conta continua existindo no Supabase Auth). */
export async function removerOficial(formData) {
  const userId = texto(formData, 'user_id');
  if (!userId || !UUID.test(userId)) return { erro: 'Oficial não identificado.' };
  const supabase = await createClient();
  const recusa = await recusaDeGravacao(supabase, { administrador: true });
  if (recusa) return { erro: recusa };
  const { error } = await supabase.rpc('oficial_remover', { p_user_id: userId });
  if (error) return { erro: traduzirErroOficial(error) };
  revalidatePath('/', 'layout');
  return { ok: true };
}

// ---------- fechamento do caixa ----------

/**
 * Define até que data o caixa de uma Ordem está fechado; data vazia reabre o caixa.
 * Só administradores (a política de `caixa_fechamento` também exige).
 */
export async function salvarFechamento(formData) {
  const ordem = lerOrdem(formData.get('ordem'));
  const ate = texto(formData, 'fechado_ate');
  if (!ordem) return { erro: 'Ordem não identificada.' };
  if (ate && !dataValida(ate)) return { erro: 'Data de fechamento inválida.' };
  if (ate && ate > hojeISO()) return { erro: 'O fechamento não pode ter data futura.' };
  const supabase = await createClient();
  const recusa = await recusaDeGravacao(supabase, { administrador: true });
  if (recusa) return { erro: recusa };
  const { user } = await obterAcesso(supabase);
  const { error } = ate
    ? await supabase.from('caixa_fechamento').upsert({ ordem: ORDEM_DB[ordem], fechado_ate: ate, definido_por_email: user?.email ?? null }, { onConflict: 'ordem' })
    : await supabase.from('caixa_fechamento').delete().eq('ordem', ORDEM_DB[ordem]);
  if (error) return { erro: `Não foi possível salvar. ${error.message}` };
  revalidar();
  return { ok: true };
}

// ---------- senha da própria conta ----------

/** Troca a senha de quem está na sessão. Devolve { erro } ou { ok }. */
export async function alterarSenha(formData) {
  const nova = String(formData.get('nova') || '');
  const confirmacao = String(formData.get('confirmacao') || '');
  if (nova.length < 8) return { erro: 'A senha deve ter ao menos 8 caracteres.' };
  if (nova !== confirmacao) return { erro: 'A confirmação não confere com a nova senha.' };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: nova });
  if (error) return { erro: `Não foi possível alterar a senha. ${error.message}` };
  return { ok: true };
}
