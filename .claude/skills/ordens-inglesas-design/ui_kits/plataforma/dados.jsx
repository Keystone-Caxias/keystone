const ORDENS = { 'arco-real': 'Arco Real', marca: 'Mestre da Marca', nautas: 'Nautas da Arca Real' };

const IRMAOS = [
  { id: 1, nome: 'João Alberto Ribeiro', mat: 'AR-2026-0184', ordem: 'arco-real', capitulo: 'Capítulo 12 · Recife', grau: 'Arco Real', sit: ['success', 'Quite'], valor: '1.240,00', desde: '14/03/2019', email: 'joao.ribeiro@exemplo.br' },
  { id: 2, nome: 'Carlos Mendes Fontes', mat: 'MM-2026-0091', ordem: 'marca', capitulo: 'Loja da Marca 4 · Olinda', grau: 'Mestre da Marca', sit: ['warning', 'Pendente'], valor: '620,00', desde: '02/08/2021', email: 'c.fontes@exemplo.br' },
  { id: 3, nome: 'Ruy Pereira Sampaio', mat: 'NA-2025-0042', ordem: 'nautas', capitulo: 'Arca 2 · Jaboatão', grau: 'Comandante Nauta', sit: ['danger', 'Vencido'], valor: '380,00', desde: '19/11/2017', email: 'ruy.sampaio@exemplo.br' },
  { id: 4, nome: 'Antônio Vilela Braga', mat: 'AR-2024-0117', ordem: 'arco-real', capitulo: 'Capítulo 12 · Recife', grau: 'Escriba', sit: ['success', 'Quite'], valor: '1.240,00', desde: '05/05/2015', email: 'a.braga@exemplo.br' },
  { id: 5, nome: 'Sérgio Luiz Andrade', mat: 'MM-2023-0076', ordem: 'marca', capitulo: 'Loja da Marca 4 · Olinda', grau: 'Mestre da Marca', sit: ['neutral', 'Arquivado'], valor: '0,00', desde: '30/01/2013', email: 's.andrade@exemplo.br' },
  { id: 6, nome: 'Paulo Henrique Lira', mat: 'AR-2026-0192', ordem: 'arco-real', capitulo: 'Capítulo 7 · Caruaru', grau: 'Companheiro exaltado', sit: ['success', 'Quite'], valor: '1.240,00', desde: '21/06/2022', email: 'p.lira@exemplo.br' },
];

const ADMISSOES = [
  { id: 'a1', nome: 'Marcelo Duarte Pinto', ordem: 'arco-real', origem: 'Loja Estrela do Norte 88', etapa: 2, sit: ['info', 'Em análise'], entrada: '11/06/2026', parecer: 'Escriba' },
  { id: 'a2', nome: 'Fernando Costa Neves', ordem: 'marca', origem: 'Loja Acácia 21', etapa: 3, sit: ['info', 'Em análise'], entrada: '02/06/2026', parecer: 'Tesoureiro' },
  { id: 'a3', nome: 'Otávio Reis Cunha', ordem: 'nautas', origem: 'Arca 2 · Jaboatão', etapa: 1, sit: ['warning', 'Pendente'], entrada: '28/05/2026', parecer: 'Documentação' },
  { id: 'a4', nome: 'Luís Gustavo Pimentel', ordem: 'arco-real', origem: 'Loja Fraternidade 3', etapa: 4, sit: ['success', 'Aprovado'], entrada: '14/05/2026', parecer: 'Concluído' },
];

const ETAPAS = ['Documentação', 'Parecer do Escriba', 'Quitação de taxas', 'Aprovação do Capítulo'];

const LANCAMENTOS = [
  { id: 'l1', data: '01/07/2026', doc: '2026/0184', irmao: 'João Alberto Ribeiro', tipo: 'Anuidade', ordem: 'arco-real', sit: ['success', 'Quite'], valor: '1.240,00' },
  { id: 'l2', data: '28/06/2026', doc: '2026/0183', irmao: 'Carlos Mendes Fontes', tipo: 'Anuidade', ordem: 'marca', sit: ['warning', 'Pendente'], valor: '620,00' },
  { id: 'l3', data: '25/06/2026', doc: '2026/0181', irmao: 'Ruy Pereira Sampaio', tipo: 'Anuidade', ordem: 'nautas', sit: ['danger', 'Vencido'], valor: '380,00' },
  { id: 'l4', data: '20/06/2026', doc: '2026/0179', irmao: 'Marcelo Duarte Pinto', tipo: 'Taxa de admissão', ordem: 'arco-real', sit: ['success', 'Quite'], valor: '480,00' },
  { id: 'l5', data: '18/06/2026', doc: '2026/0178', irmao: 'Antônio Vilela Braga', tipo: 'Anuidade', ordem: 'arco-real', sit: ['success', 'Quite'], valor: '1.240,00' },
  { id: 'l6', data: '12/06/2026', doc: '2026/0176', irmao: 'Paulo Henrique Lira', tipo: 'Joia de exaltação', ordem: 'arco-real', sit: ['success', 'Quite'], valor: '310,00' },
];

Object.assign(window, { ORDENS, IRMAOS, ADMISSOES, ETAPAS, LANCAMENTOS });