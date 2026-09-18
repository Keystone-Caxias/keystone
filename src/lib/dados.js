// Consultas de leitura usadas pelos Server Components. Todas recebem o cliente Supabase
// já autenticado (RLS garante que só usuários autenticados leem).

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
  return new Error(`Falha ao ${acao}: ${error.message}`);
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
