'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { POTENCIAS } from '@/lib/formatar';
import { createClient } from '@/lib/supabase/server';

const texto = (fd, k) => {
  const v = fd.get(k);
  const s = v == null ? '' : String(v).trim();
  return s === '' ? null : s;
};

function traduzirErro(error) {
  if (error.code === '23503') return 'A loja possui irmãos vinculados e não pode ser excluída.';
  if (error.code === '42501') return 'Sem permissão para gravar. Entre novamente na plataforma.';
  return `Não foi possível salvar. ${error.message}`;
}

function revalidar() {
  revalidatePath('/');
  revalidatePath('/lojas');
  revalidatePath('/cadastro');
}

export async function salvarLoja(prevState, formData) {
  const id = texto(formData, 'id');
  const nome = texto(formData, 'nome');
  const potencia = texto(formData, 'potencia_simbolica');
  if (!nome) return { erro: 'Informe o nome da loja.' };
  if (!POTENCIAS.includes(potencia)) return { erro: 'Escolha a potência simbólica: GOB, CMSB ou COMAB.' };
  const loja = { nome, potencia_simbolica: potencia, endereco: texto(formData, 'endereco') };

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from('loja').update(loja).eq('id', id)
    : await supabase.from('loja').insert(loja);
  if (error) return { erro: traduzirErro(error) };
  revalidar();
  redirect(`/lojas?msg=${id ? 'atualizada' : 'criada'}`);
}

export async function excluirLoja(prevState, formData) {
  const id = texto(formData, 'id');
  if (!id) return { erro: 'Loja não identificada.' };
  const supabase = await createClient();
  const { error } = await supabase.from('loja').delete().eq('id', id);
  if (error) return { erro: traduzirErro(error) };
  revalidar();
  redirect('/lojas?msg=excluida');
}
