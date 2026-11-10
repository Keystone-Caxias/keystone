export const ORDENS = { 'arco-real': 'Arco Real', marca: 'Mestre da Marca', nautas: 'Nautas da Arca Real' };
export const POTENCIAS = ['GOB', 'CMSB', 'COMAB'];

// A interface e as URLs usam as chaves do design system ('arco-real', 'marca', 'nautas');
// o banco usa os nomes das tabelas ('arco_real', 'marca', 'nauta'), também no enum ordem_inglesa.
export const ORDEM_DB = { 'arco-real': 'arco_real', marca: 'marca', nautas: 'nauta' };
export const ORDEM_UI = { arco_real: 'arco-real', marca: 'marca', nauta: 'nautas' };

export const TIPOS_LANCAMENTO = { entrada: 'Entrada', saida: 'Saída' };

/** Fuso de referência: o servidor (Vercel) roda em UTC, os oficiais não. */
export const FUSO = 'America/Sao_Paulo';

/** 'AAAA-MM-DD' -> 'DD/MM/AAAA'; vazio -> '—'. */
export function formatarData(iso) {
  if (!iso) return '—';
  const [a, m, d] = String(iso).slice(0, 10).split('-');
  return a && m && d ? `${d}/${m}/${a}` : String(iso);
}

/** ISO timestamp -> 'DD/MM/AAAA HH:MM' no fuso de Brasília (igual no servidor e no navegador). */
export function formatarDataHora(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  // Montado por partes: o separador entre data e hora varia entre versões do ICU,
  // e servidor e navegador precisam produzir exatamente o mesmo texto.
  const partes = new Intl.DateTimeFormat('pt-BR', { timeZone: FUSO, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d);
  const p = Object.fromEntries(partes.map((x) => [x.type, x.value]));
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
}

/** '12345678901' -> '123.456.789-01'. */
export function formatarCpf(cpf) {
  const d = String(cpf || '').replace(/\D/g, '');
  return d.length === 11 ? d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : (cpf || '—');
}

// ---------- dinheiro ----------
// No banco o valor é NUMERIC(12,2); no JavaScript, sempre centavos inteiros (somas exatas).

const MAX_CENTAVOS = 999_999_999_999; // NUMERIC(12,2)

/** Valor vindo do banco (1240.5 ou '1240.50') -> centavos inteiros. */
export function centavos(valor) {
  const n = Number(valor);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

/** Centavos -> texto para gravar em coluna NUMERIC ('1240.50'). */
export function centavosParaNumeric(c) {
  const n = Math.round(Number(c) || 0);
  const abs = Math.abs(n);
  return `${n < 0 ? '-' : ''}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
}

/** Centavos -> 'R$ 1.240,50'; negativo -> '-R$ 1.240,50'. Com { simbolo: false }, só '1.240,50'. */
export function formatarMoeda(c, { simbolo = true } = {}) {
  const n = Math.round(Number(c) || 0);
  const abs = Math.abs(n);
  const inteiro = String(Math.floor(abs / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${n < 0 ? '-' : ''}${simbolo ? 'R$ ' : ''}${inteiro},${String(abs % 100).padStart(2, '0')}`;
}

/**
 * Texto digitado -> centavos inteiros, ou null se não for um valor positivo válido.
 * Aceita '1.240,50', '1240,50', '1240.50', '1240', 'R$ 12,5'. Com vírgula, ponto é milhar;
 * sem vírgula, ponto só é milhar em grupos de três ('1.240'), senão é decimal ('12.50').
 */
export function lerMoeda(texto) {
  let s = String(texto ?? '').replace(/R\$/i, '').replace(/\s/g, '');
  if (!s) return null;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  const [inteiro, decimal = ''] = s.split('.');
  const c = Number(inteiro) * 100 + Number(decimal.padEnd(2, '0'));
  return Number.isSafeInteger(c) && c > 0 && c <= MAX_CENTAVOS ? c : null;
}

// ---------- datas e períodos ----------

/** true para 'AAAA-MM-DD' que existe no calendário. */
export function dataValida(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** Data de hoje ('AAAA-MM-DD') no fuso de Brasília. */
export function hojeISO() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

/** { de, ate } do ano civil da data informada (padrão: hoje). */
export function periodoDoAno(iso = hojeISO()) {
  const ano = iso.slice(0, 4);
  return { de: `${ano}-01-01`, ate: `${ano}-12-31` };
}

/** { de, ate } do mês da data informada (padrão: hoje). */
export function periodoDoMes(iso = hojeISO()) {
  const [ano, mes] = iso.split('-').map(Number);
  const ultimoDia = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  const prefixo = iso.slice(0, 7);
  return { de: `${prefixo}-01`, ate: `${prefixo}-${String(ultimoDia).padStart(2, '0')}` };
}

/**
 * Período a partir de parâmetros de URL. Datas ausentes, malformadas ou invertidas
 * caem no ano civil corrente.
 */
export function lerPeriodo(de, ate) {
  if (dataValida(de) && dataValida(ate) && de <= ate) return { de, ate };
  return periodoDoAno();
}

/** Chave de Ordem vinda de URL ou formulário: devolve a chave se for uma das três, senão ''. */
export function lerOrdem(valor) {
  return typeof valor === 'string' && Object.hasOwn(ORDENS, valor) ? valor : '';
}
