'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { recusaDeGravacao } from '@/lib/acesso';
import { SITUACOES, cpfValido, formatarData, hojeISO } from '@/lib/formatar';
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
const situacao = (fd, k) => {
  const s = texto(fd, k);
  return s && Object.hasOwn(SITUACOES, s) ? s : 'ativo';
};

/**
 * Coerência das datas: nenhuma no futuro e cada sequência em ordem (datas vazias são ignoradas).
 * `sequencias` = listas de [rótulo, data] que devem estar em ordem crescente.
 */
function erroDeDatas(sequencias) {
  const hoje = hojeISO();
  for (const seq of sequencias) {
    const preenchidas = seq.filter(([, d]) => d);
    for (const [rotulo, d] of preenchidas) {
      if (d > hoje) return `${rotulo} (${formatarData(d)}) não pode ser uma data futura.`;
    }
    for (let i = 1; i < preenchidas.length; i += 1) {
      const [antes, depois] = [preenchidas[i - 1], preenchidas[i]];
      if (depois[1] < antes[1]) return `${depois[0]} (${formatarData(depois[1])}) não pode ser anterior a ${antes[0].toLowerCase()} (${formatarData(antes[1])}).`;
    }
  }
  return null;
}

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
  if (!cpfValido(cpf)) return { erro: 'CPF inválido: confira os dígitos.' };

  const macom = {
    nome,
    cpf,
    foto: texto(formData, 'foto'),
    data_nascimento: data(formData, 'data_nascimento'),
    data_falecimento: data(formData, 'data_falecimento'),
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

  const temAR = ligado(formData, 'tem_arco_real');
  const temMarca = ligado(formData, 'tem_marca');
  const temNauta = ligado(formData, 'tem_nauta');
  const d = (k) => data(formData, k);
  const erroDatas = erroDeDatas([
    [['Nascimento', macom.data_nascimento], ['Iniciação', macom.data_iniciacao], ['Passagem', macom.data_passagem], ['Elevação', macom.data_elevacao], ['Instalação (MI)', macom.data_instalacao_mi]],
    [['Nascimento', macom.data_nascimento], ['Falecimento', macom.data_falecimento]],
    ...(temAR ? [[['Nascimento', macom.data_nascimento], ['Exaltação', d('ar_data_exaltacao')], ['Instalação 3º P', d('ar_data_instalacao_3p')], ['Instalação 2º P', d('ar_data_instalacao_2p')], ['Instalação 1º P', d('ar_data_instalacao_1p')]], [['Situação no Arco Real desde', d('ar_situacao_desde')]]] : []),
    ...(temMarca ? [[['Nascimento', macom.data_nascimento], ['Avançamento', d('ma_data_avancamento')], ['Instalação VM', d('ma_data_instalacao_vm')]], [['Situação na Marca desde', d('ma_situacao_desde')]]] : []),
    ...(temNauta ? [[['Nascimento', macom.data_nascimento], ['Elevação a Nauta', d('na_data_elevacao')], ['Instalação VC', d('na_data_instalacao_vc')]], [['Situação em Nautas desde', d('na_situacao_desde')]]] : []),
  ]);
  if (erroDatas) return { erro: erroDatas };

  const supabase = await createClient();
  const recusa = await recusaDeGravacao(supabase);
  if (recusa) return { erro: recusa };
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
    ['arco_real', temAR, {
      situacao: situacao(formData, 'ar_situacao'),
      situacao_desde: data(formData, 'ar_situacao_desde'),
      nome_capitulo: texto(formData, 'ar_nome_capitulo'),
      proposto_por: texto(formData, 'ar_proposto_por'),
      secundado_por: texto(formData, 'ar_secundado_por'),
      data_exaltacao: data(formData, 'ar_data_exaltacao'),
      data_instalacao_3p: data(formData, 'ar_data_instalacao_3p'),
      data_instalacao_2p: data(formData, 'ar_data_instalacao_2p'),
      data_instalacao_1p: data(formData, 'ar_data_instalacao_1p'),
    }],
    ['marca', temMarca, {
      situacao: situacao(formData, 'ma_situacao'),
      situacao_desde: data(formData, 'ma_situacao_desde'),
      nome_loja_marca: texto(formData, 'ma_nome_loja_marca'),
      proposto_por: texto(formData, 'ma_proposto_por'),
      secundado_por: texto(formData, 'ma_secundado_por'),
      data_avancamento: data(formData, 'ma_data_avancamento'),
      data_instalacao_vm: data(formData, 'ma_data_instalacao_vm'),
      marca_candidato: texto(formData, 'ma_marca_candidato'),
    }],
    ['nauta', temNauta, {
      situacao: situacao(formData, 'na_situacao'),
      situacao_desde: data(formData, 'na_situacao_desde'),
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

/**
 * Exclui um irmão (os registros de Ordem caem em cascata). Usado via useActionState.
 * Irmão com lançamentos no caixa não pode ser excluído (FK RESTRICT em lancamento_caixa).
 */
export async function excluirIrmao(prevState, formData) {
  const id = texto(formData, 'id');
  if (!id) return { erro: 'Irmão não identificado.' };
  const supabase = await createClient();
  const recusa = await recusaDeGravacao(supabase);
  if (recusa) return { erro: recusa };
  const { error } = await supabase.from('macom').delete().eq('id', id);
  if (error) {
    if (error.code === '23503') return { erro: 'Este irmão tem lançamentos no caixa e não pode ser excluído. Os lançamentos aparecem na Tesouraria, buscando pelo nome dele.' };
    return { erro: traduzirErro(error) };
  }
  revalidar();
  redirect('/cadastro?msg=excluido');
}
