// Consultas de leitura usadas pelos Server Components. Todas recebem o cliente Supabase
// já autenticado (RLS garante que só usuários autenticados leem).
import { ORDEM_DB, ORDEM_UI, centavos } from './formatar';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SELECT_IRMAO = 'id, nome, cpf, cim, email, telefone, data_nascimento, endereco, cep, foto, data_iniciacao, data_passagem, data_elevacao, data_instalacao_mi, loja_id, created_at, updated_at, loja(id, nome, potencia_simbolica), arco_real(*), marca(*), nauta(*)';

function um(x) {
  return Array.isArray(x) ? (x[0] ?? null) : (x ?? null);
}

/** Achata os embeds do PostgREST e deriva a lista de Ordens do irmão. */
export function normalizarIrmao(r) {
  const arco_real = um(r.arco_real);
  const marca = um(r.marca);
  const nauta = um(r.nauta);
  const ordens = [];
  if (arco_real) ordens.push('arco-real');
  if (marca) ordens.push('marca');
  if (nauta) ordens.push('nautas');
  return { ...r, loja: um(r.loja), arco_real, marca, nauta, ordens };
}

function falha(acao, error) {
  return new Error(`Falha ao ${acao}: ${error.message || error.details || error.code || 'erro desconhecido'}`);
}

export async function listarIrmaos(supabase) {
  const { data, error } = await supabase.from('macom').select(SELECT_IRMAO).order('nome', { ascending: true }).limit(2000);
  if (error) throw falha('listar irmãos', error);
  return (data ?? []).map(normalizarIrmao);
}

export async function irmaosRecentes(supabase, quantos = 6) {
  const { data, error } = await supabase.from('macom').select(SELECT_IRMAO).order('created_at', { ascending: false }).limit(quantos);
  if (error) throw falha('listar cadastros recentes', error);
  return (data ?? []).map(normalizarIrmao);
}

export async function obterIrmao(supabase, id) {
  if (!UUID.test(id)) return null;
  const { data, error } = await supabase.from('macom').select(SELECT_IRMAO).eq('id', id).maybeSingle();
  if (error) throw falha('carregar irmão', error);
  return data ? normalizarIrmao(data) : null;
}

export async function listarLojas(supabase) {
  const { data, error } = await supabase.from('loja').select('id, nome, potencia_simbolica, endereco, created_at').order('nome', { ascending: true });
  if (error) throw falha('listar lojas', error);
  return data ?? [];
}

export async function obterLoja(supabase, id) {
  const { data, error } = await supabase.from('loja').select('id, nome, potencia_simbolica, endereco').eq('id', id).maybeSingle();
  if (error) throw falha('carregar loja', error);
  return data;
}

/** Quantidade de irmãos por loja: { [loja_id]: n }. */
export async function membrosPorLoja(supabase) {
  const { data, error } = await supabase.from('macom').select('loja_id');
  if (error) throw falha('contar irmãos por loja', error);
  const mapa = {};
  for (const r of data ?? []) if (r.loja_id) mapa[r.loja_id] = (mapa[r.loja_id] ?? 0) + 1;
  return mapa;
}

/** Contagem de registros nas cinco tabelas. */
export async function contagens(supabase) {
  const tabelas = ['macom', 'arco_real', 'marca', 'nauta', 'loja'];
  const resultados = await Promise.all(tabelas.map((t) => supabase.from(t).select('id', { count: 'exact', head: true })));
  const saida = {};
  tabelas.forEach((t, i) => {
    if (resultados[i].error) throw falha(`contar ${t}`, resultados[i].error);
    saida[t] = resultados[i].count ?? 0;
  });
  return saida;
}

/** Nome e id de todos os irmãos, para caixas de seleção. */
export async function listarIrmaosResumo(supabase) {
  const { data, error } = await supabase.from('macom').select('id, nome').order('nome', { ascending: true }).limit(1000);
  if (error) throw falha('listar irmãos', error);
  return data ?? [];
}

/** Irmãos que têm registro na Ordem ('arco-real' | 'marca' | 'nautas'), com o cadastro completo. */
export async function listarIrmaosDaOrdem(supabase, ordem) {
  const tabela = ORDEM_DB[ordem];
  if (!tabela) return [];
  const select = SELECT_IRMAO.replace(`${tabela}(*)`, `${tabela}!inner(*)`);
  const { data, error } = await supabase.from('macom').select(select).order('nome', { ascending: true }).limit(1000);
  if (error) throw falha('listar irmãos da Ordem', error);
  return (data ?? []).map(normalizarIrmao);
}

// ---------- caixa das Ordens ----------
// Para as telas, `ordem` usa as chaves de interface ('arco-real', 'marca', 'nautas')
// e `valor` vem em centavos inteiros.

const SELECT_LANCAMENTO = 'id, ordem, tipo, data, valor, descricao, categoria_id, macom_id, criado_por_email, created_at, updated_at, categoria:categoria_caixa(id, nome), irmao:macom(id, nome)';
const PAGINA = 1000; // teto de linhas por resposta da API do Supabase
const MAX_PAGINAS = 10;

function normalizarLancamento(r) {
  return { ...r, ordem: ORDEM_UI[r.ordem], valor: centavos(r.valor), categoria: um(r.categoria), irmao: um(r.irmao) };
}

export async function listarCategorias(supabase) {
  const { data, error } = await supabase.from('categoria_caixa').select('id, nome, tipo');
  if (error) throw falha('listar categorias', error);
  return (data ?? []).sort((a, b) => a.tipo.localeCompare(b.tipo) || a.nome.localeCompare(b.nome, 'pt-BR'));
}

/**
 * Lançamentos do mais recente para o mais antigo, filtrados por Ordem e período (ambos opcionais).
 * Lê em páginas de 1000 até acabar; `truncado` avisa quando o teto de páginas foi atingido.
 */
export async function listarLancamentos(supabase, { ordem, de, ate } = {}) {
  const linhas = [];
  for (let pagina = 0; pagina < MAX_PAGINAS; pagina += 1) {
    let consulta = supabase.from('lancamento_caixa').select(SELECT_LANCAMENTO)
      .order('data', { ascending: false })
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(pagina * PAGINA, (pagina + 1) * PAGINA - 1);
    if (ordem) consulta = consulta.eq('ordem', ORDEM_DB[ordem]);
    if (de) consulta = consulta.gte('data', de);
    if (ate) consulta = consulta.lte('data', ate);
    const { data, error } = await consulta;
    if (error) throw falha('listar lançamentos', error);
    linhas.push(...(data ?? []).map(normalizarLancamento));
    if (!data || data.length < PAGINA) return { linhas, truncado: false };
  }
  return { linhas, truncado: true };
}

export async function obterLancamento(supabase, id) {
  if (!UUID.test(id)) return null;
  const { data, error } = await supabase.from('lancamento_caixa').select(SELECT_LANCAMENTO).eq('id', id).maybeSingle();
  if (error) throw falha('carregar lançamento', error);
  return data ? normalizarLancamento(data) : null;
}

/**
 * Totais exatos por Ordem, calculados no banco (função caixa_resumo):
 * { 'arco-real': { saldoAnterior, entradas, saidas, saldoFinal, lancamentos }, marca: …, nautas: … }.
 * Sem período, devolve a posição atual do caixa (tudo o que já foi lançado).
 */
export async function resumoCaixa(supabase, { de = '0001-01-01', ate = '9999-12-31' } = {}) {
  const { data, error } = await supabase.rpc('caixa_resumo', { p_inicio: de, p_fim: ate });
  if (error) throw falha('calcular o resumo do caixa', error);
  const resumo = {};
  for (const r of data ?? []) {
    resumo[ORDEM_UI[r.ordem]] = {
      saldoAnterior: centavos(r.saldo_anterior),
      entradas: centavos(r.entradas),
      saidas: centavos(r.saidas),
      saldoFinal: centavos(r.saldo_final),
      lancamentos: Number(r.lancamentos) || 0,
    };
  }
  return resumo;
}
