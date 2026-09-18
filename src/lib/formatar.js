export const ORDENS = { 'arco-real': 'Arco Real', marca: 'Mestre da Marca', nautas: 'Nautas da Arca Real' };
export const POTENCIAS = ['GOB', 'CMSB', 'COMAB'];

/** 'AAAA-MM-DD' -> 'DD/MM/AAAA'; vazio -> '—'. */
export function formatarData(iso) {
  if (!iso) return '—';
  const [a, m, d] = String(iso).slice(0, 10).split('-');
  return a && m && d ? `${d}/${m}/${a}` : String(iso);
}

/** ISO timestamp -> 'DD/MM/AAAA HH:MM' no fuso do navegador/servidor. */
export function formatarDataHora(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/** '12345678901' -> '123.456.789-01'. */
export function formatarCpf(cpf) {
  const d = String(cpf || '').replace(/\D/g, '');
  return d.length === 11 ? d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : (cpf || '—');
}
