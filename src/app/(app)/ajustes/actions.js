'use server';
import { revalidatePath } from 'next/cache';
import { TIPOS_LANCAMENTO } from '@/lib/formatar';
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
  const { error } = await supabase.from('categoria_caixa').delete().eq('id', id);
  if (error) return { erro: traduzirErro(error) };
  revalidar();
  return { ok: true };
}
