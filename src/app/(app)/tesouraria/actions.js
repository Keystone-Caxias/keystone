'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ORDEM_DB, TIPOS_LANCAMENTO, centavosParaNumeric, dataValida, lerMoeda, lerOrdem, periodoDoAno } from '@/lib/formatar';
import { createClient } from '@/lib/supabase/server';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const texto = (fd, k) => {
  const v = fd.get(k);
  const s = v == null ? '' : String(v).trim();
  return s === '' ? null : s;
};
const uuid = (fd, k) => {
  const s = texto(fd, k);
  return s && UUID.test(s) ? s : null;
};

function traduzirErro(error) {
  if (error.code === '23503' && /categoria/.test(error.message || '')) return 'A categoria escolhida não vale para este tipo de lançamento. Escolha outra categoria.';
  if (error.code === '23503') return 'O irmão escolhido não consta mais no cadastro.';
  if (error.code === '23514') return 'O valor deve ser maior que zero.';
  if (error.code === '42501') return 'Sem permissão para gravar. Entre novamente na plataforma.';
  return `Não foi possível salvar. ${error.message}`;
}

function revalidar() {
  revalidatePath('/');
  revalidatePath('/tesouraria');
}

/**
 * Endereço da lista para onde voltar: os filtros de onde o oficial veio (campos volta_*),
 * ajustados para que um lançamento recém-gravado apareça (Ordem e período certos).
 */
function lista(formData, msg, lancamento) {
  let ordem = lerOrdem(formData.get('volta_ordem'));
  let de = texto(formData, 'volta_de');
  let ate = texto(formData, 'volta_ate');
  if (!dataValida(de) || !dataValida(ate) || de > ate) ({ de, ate } = periodoDoAno());
  if (lancamento) {
    if (ordem && ordem !== lancamento.ordem) ordem = lancamento.ordem;
    if (lancamento.data < de || lancamento.data > ate) ({ de, ate } = periodoDoAno(lancamento.data));
  }
  return `/tesouraria?${new URLSearchParams({ ...(ordem && { ordem }), de, ate, msg })}`;
}

/** Cria ou atualiza um lançamento do caixa. Usado via useActionState. */
export async function salvarLancamento(prevState, formData) {
  const id = texto(formData, 'id');
  const ordem = lerOrdem(formData.get('ordem'));
  const tipo = texto(formData, 'tipo');
  const data = texto(formData, 'data');
  const valor = lerMoeda(formData.get('valor'));
  const categoriaId = uuid(formData, 'categoria_id');
  const descricao = texto(formData, 'descricao');

  if (!ordem) return { erro: 'Escolha a Ordem do lançamento.' };
  if (!tipo || !Object.hasOwn(TIPOS_LANCAMENTO, tipo)) return { erro: 'Informe se é entrada ou saída.' };
  if (!dataValida(data)) return { erro: 'Informe a data do lançamento.' };
  if (valor == null) return { erro: 'Informe um valor maior que zero, como 1.240,50.' };
  if (!categoriaId) return { erro: 'Escolha a categoria.' };
  if (descricao && descricao.length > 500) return { erro: 'A descrição deve ter no máximo 500 caracteres.' };

  const lancamento = {
    ordem: ORDEM_DB[ordem],
    tipo,
    data,
    valor: centavosParaNumeric(valor),
    categoria_id: categoriaId,
    descricao,
    macom_id: uuid(formData, 'macom_id'),
  };

  const supabase = await createClient();
  if (id) {
    if (!UUID.test(id)) return { erro: 'Lançamento não identificado.' };
    const { data: alterados, error } = await supabase.from('lancamento_caixa').update(lancamento).eq('id', id).select('id');
    if (error) return { erro: traduzirErro(error) };
    if (!alterados || alterados.length === 0) return { erro: 'Lançamento não encontrado. Ele pode ter sido excluído por outro oficial.' };
  } else {
    const { error } = await supabase.from('lancamento_caixa').insert(lancamento);
    if (error) return { erro: traduzirErro(error) };
  }

  revalidar();
  redirect(lista(formData, id ? 'atualizado' : 'criado', { ordem, data }));
}

/** Exclui um lançamento do caixa. Usado via useActionState. */
export async function excluirLancamento(prevState, formData) {
  const id = texto(formData, 'id');
  if (!id || !UUID.test(id)) return { erro: 'Lançamento não identificado.' };
  const supabase = await createClient();
  const { error } = await supabase.from('lancamento_caixa').delete().eq('id', id);
  if (error) return { erro: traduzirErro(error) };
  revalidar();
  redirect(lista(formData, 'excluido'));
}
