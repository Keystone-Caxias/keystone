'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const texto = (fd, k) => {
  const v = fd.get(k);
  const s = v == null ? '' : String(v).trim();
  return s === '' ? null : s;
};
const data = (fd, k) => {
  const s = texto(fd, k);
  return s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
};
const ligado = (fd, k) => fd.get(k) === 'on';

function traduzirErro(error) {
  if (error.code === '23505') return 'Já existe um irmão cadastrado com este CPF.';
  if (error.code === '42501') return 'Sem permissão para gravar. Entre novamente na plataforma.';
  if (error.code === '22007' || error.code === '22008') return 'Alguma data está em formato inválido.';
  return `Não foi possível salvar. ${error.message}`;
}

function revalidar() {
  revalidatePath('/');
  revalidatePath('/cadastro');
}

/** Cria ou atualiza um irmão e os seus registros de Arco Real, Marca e Nauta. */
export async function salvarIrmao(prevState, formData) {
  const id = texto(formData, 'id');
  const nome = texto(formData, 'nome');
  const cpf = (texto(formData, 'cpf') || '').replace(/\D/g, '');
  if (!nome) return { erro: 'Informe o nome do irmão.' };
  if (cpf.length !== 11) return { erro: 'CPF deve ter 11 dígitos.' };

  const macom = {
    nome,
    cpf,
    foto: texto(formData, 'foto'),
    data_nascimento: data(formData, 'data_nascimento'),
    telefone: texto(formData, 'telefone'),
    email: texto(formData, 'email'),
    endereco: texto(formData, 'endereco'),
    cep: texto(formData, 'cep'),
    cim: texto(formData, 'cim'),
    data_iniciacao: data(formData, 'data_iniciacao'),
    data_passagem: data(formData, 'data_passagem'),
    data_elevacao: data(formData, 'data_elevacao'),
    data_instalacao_mi: data(formData, 'data_instalacao_mi'),
    loja_id: texto(formData, 'loja_id'),
  };

  const supabase = await createClient();
  let macomId = id;
  if (id) {
    const { error } = await supabase.from('macom').update(macom).eq('id', id);
    if (error) return { erro: traduzirErro(error) };
  } else {
    const { data: criado, error } = await supabase.from('macom').insert(macom).select('id').single();
    if (error) return { erro: traduzirErro(error) };
    macomId = criado.id;
  }

  const ordens = [
    ['arco_real', ligado(formData, 'tem_arco_real'), {
      nome_capitulo: texto(formData, 'ar_nome_capitulo'),
      proposto_por: texto(formData, 'ar_proposto_por'),
      secundado_por: texto(formData, 'ar_secundado_por'),
      data_exaltacao: data(formData, 'ar_data_exaltacao'),
      data_instalacao_3p: data(formData, 'ar_data_instalacao_3p'),
      data_instalacao_2p: data(formData, 'ar_data_instalacao_2p'),
      data_instalacao_1p: data(formData, 'ar_data_instalacao_1p'),
    }],
    ['marca', ligado(formData, 'tem_marca'), {
      nome_loja_marca: texto(formData, 'ma_nome_loja_marca'),
      proposto_por: texto(formData, 'ma_proposto_por'),
      secundado_por: texto(formData, 'ma_secundado_por'),
      data_avancamento: data(formData, 'ma_data_avancamento'),
      data_instalacao_vm: data(formData, 'ma_data_instalacao_vm'),
      marca_candidato: texto(formData, 'ma_marca_candidato'),
    }],
    ['nauta', ligado(formData, 'tem_nauta'), {
      nome_loja_nauta: texto(formData, 'na_nome_loja_nauta'),
      data_elevacao: data(formData, 'na_data_elevacao'),
      data_instalacao_vc: data(formData, 'na_data_instalacao_vc'),
    }],
  ];
  for (const [tabela, presente, campos] of ordens) {
    const { error } = presente
      ? await supabase.from(tabela).upsert({ macom_id: macomId, ...campos }, { onConflict: 'macom_id' })
      : await supabase.from(tabela).delete().eq('macom_id', macomId);
    if (error) return { erro: traduzirErro(error) };
  }

  revalidar();
  redirect(`/cadastro?msg=${id ? 'atualizado' : 'criado'}`);
}

/** Exclui um irmão (os registros de Ordem caem em cascata). */
export async function excluirIrmao(formData) {
  const id = texto(formData, 'id');
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase.from('macom').delete().eq('id', id);
  if (error) throw new Error(traduzirErro(error));
  revalidar();
  redirect('/cadastro?msg=excluido');
}
