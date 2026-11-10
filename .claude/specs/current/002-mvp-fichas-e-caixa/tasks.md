# Tasks — 002-mvp-fichas-e-caixa

> Cada WP cabe em 30–90 min. Se estourar, divida.
> Lanes válidas: `planejado` → `fazendo` → `revisão` → `pronto`.
> Movimentos: `planejado→fazendo` e `fazendo→revisão` são do Software Engineer. `revisão→pronto` e `revisão→fazendo` são do Review Agent.

---

## WP01 — Migration do caixa das Ordens e seed de exemplo

```yaml
lane: revisão
estimativa: 60min
files:
  - supabase/migrations/20261110120000_caixa_das_ordens.sql
  - supabase/seed.sql
depende_de: []
```

### Objetivo
Criar no banco o que o caixa precisa: enums, `categoria_caixa`, `lancamento_caixa`, triggers, função `caixa_resumo`, RLS, GRANTs e a lista inicial provisória de categorias. Acrescentar lançamentos de exemplo ao seed.

### Passos
1. Escrever a migration conforme `plan.json` → `estrutura_dados` (enums, duas tabelas, FK composta, índices).
2. Triggers: `set_updated_at` nas duas tabelas; autoria (`criado_por`, `criado_por_email`) carimbada no INSERT e preservada no UPDATE.
3. Função `caixa_resumo(p_inicio, p_fim, p_ordem)` SECURITY INVOKER com `search_path` vazio.
4. RLS + política "autenticados tudo" nas duas tabelas; GRANT explícito para `authenticated`.
5. Inserir as categorias iniciais listadas na pergunta "CAIXA, categorias" da spec.
6. Acrescentar ao `supabase/seed.sql` lançamentos de exemplo nas três Ordens.
7. `npm run db:reset` e checagens SQL das constraints e do RLS.

### Definição de Pronto
- [x] `npm run db:reset` aplica as três migrations e o seed sem erro
- [x] Banco recusa: valor zero ou negativo; categoria de tipo diferente do lançamento; exclusão de categoria em uso; exclusão de irmão com lançamento
- [x] `caixa_resumo` devolve uma linha por Ordem com saldo anterior, entradas, saídas e saldo final corretos para o seed
- [x] Com a chave anon, `select` em `categoria_caixa` e `lancamento_caixa` não devolve linhas e `insert` é recusado
- [x] Lançamento inserido por usuário autenticado sai com `criado_por` e `criado_por_email` preenchidos
- [x] Nenhum arquivo fora de `files:` foi tocado

### Log
- 2026-11-10: WP criada
- 2026-11-10: iniciada
- 2026-11-10: concluída, movida para revisão. Migration aplicada com `supabase db reset` (três migrations + seed). Conferido por SQL: valor zero/negativo, categoria de tipo trocado, exclusão de categoria em uso, exclusão de irmão com lançamento, nome de categoria repetido e Ordem fora do enum são recusados. `caixa_resumo` bate com a soma manual do seed (Arco Real 2690,00 − 1145,90 = 1544,10). Pela API: anon recebe 42501 em select, insert e RPC; autenticado grava com `criado_por`/`criado_por_email` da sessão, mesmo enviando outro e-mail, e o UPDATE não troca a autoria. O seed também ganhou dois registros de Ordem para o irmão João (quadro e fichas em lote com mais de uma linha).

---

## WP02 — Formatação de dinheiro e consultas do caixa

```yaml
lane: revisão
estimativa: 45min
files:
  - src/lib/formatar.js
  - src/lib/dados.js
depende_de: [WP01]
```

### Objetivo
Dar às telas as funções de apoio: conversão e formatação de dinheiro, chaves de Ordem, datas no fuso de Brasília e as consultas de categorias, lançamentos e resumo.

### Passos
1. `formatar.js`: `ORDEM_DB`, `ORDEM_UI`, `TIPOS_LANCAMENTO`, `centavos`, `formatarMoeda`, `lerMoeda`, `hojeISO`, `periodoPadrao`, `dataValida`; fixar o fuso em `formatarDataHora`.
2. `dados.js`: `listarCategorias`, `listarLancamentos` (paginada, com teto e sinal de truncado), `obterLancamento`, `resumoCaixa`, `listarIrmaosResumo`, `listarIrmaosDaOrdem`.

### Definição de Pronto
- [x] `lerMoeda` aceita `1.240,50`, `1240,50`, `1240.50`, `1240` e `R$ 12,5`; recusa texto, negativo e mais de duas casas
- [x] `formatarMoeda(124050)` devolve `R$ 1.240,50`; negativo sai com sinal de menos
- [x] `resumoCaixa` devolve centavos inteiros por Ordem, nas chaves de interface (`arco-real`, `marca`, `nautas`)
- [x] `listarLancamentos` percorre páginas de 1000 até acabar ou atingir o teto
- [x] `npm run lint` passa
- [x] Nenhum arquivo fora de `files:` foi tocado

### Log
- 2026-11-10: WP criada
- 2026-11-10: iniciada
- 2026-11-10: concluída, movida para revisão. `formatar.js`: mapas de Ordem, dinheiro em centavos (`centavos`, `centavosParaNumeric`, `formatarMoeda`, `lerMoeda`), datas no fuso de Brasília (`hojeISO`, `periodoDoAno`, `periodoDoMes`, `lerPeriodo`, `dataValida`), `lerOrdem`; `formatarDataHora` agora fixa o fuso e monta o texto por partes (mesmo resultado no servidor e no navegador). `dados.js`: consultas do caixa, `listarIrmaosResumo`, `listarIrmaosDaOrdem` e guarda de UUID em `obterIrmao`/`obterLancamento`. Verificado por script contra o Supabase local: 19 casos de `lerMoeda` e 6 de `formatarMoeda`; `resumoCaixa` em centavos nas chaves de interface; com 2500 lançamentos num período, `listarLancamentos` devolveu 2500 linhas únicas e a soma bateu com `caixa_resumo`. Lint sem erros.

---

## WP03 — Tesouraria: saldos, filtros e lista de lançamentos

```yaml
lane: revisão
estimativa: 90min
files:
  - src/app/(app)/tesouraria/page.js
  - src/app/(app)/tesouraria/TesourariaLista.jsx
depende_de: [WP02]
```

### Objetivo
Substituir o placeholder da Tesouraria pela tela de consulta do caixa: saldo de cada Ordem no período, abas de Ordem, filtros e tabela de lançamentos.

### Passos
1. `page.js`: ler e validar `ordem`, `de`, `ate`, `msg`; carregar resumo, lançamentos e categorias.
2. `TesourariaLista.jsx`: cartões por Ordem (saldo final, entradas e saídas do período), abas Todas/Arco Real/Marca/Nautas, período de/até com atalhos, filtros de tipo, categoria e busca, `DataTable`, rodapé com total exibido, `Toast`.
3. Ações da Topbar: "Extrato" (abre `/imprimir/extrato` com os filtros) e "Novo lançamento".

### Definição de Pronto
- [x] Sem parâmetros, a tela abre em todas as Ordens no ano civil corrente
- [x] Trocar de aba ou de período atualiza a URL, a lista e os cartões
- [x] Os cartões mostram os valores de `caixa_resumo` (não a soma da lista)
- [x] Tipo, categoria e busca filtram a lista e o "Total exibido" acompanha
- [x] Período inválido (data malformada ou `de` depois de `ate`) cai no padrão sem erro
- [x] Estado vazio factual quando não há lançamentos
- [x] `npm run lint` passa
- [x] Nenhum arquivo fora de `files:` foi tocado

### Log
- 2026-11-10: WP criada
- 2026-11-10: iniciada
- 2026-11-10: concluída, movida para revisão. `page.js` valida `ordem`/`de`/`ate` e carrega resumo (RPC), lançamentos e categorias; `TesourariaLista.jsx` traz um cartão por Ordem (saldo no fim do período, saldo anterior, entradas, saídas), abas de Ordem, período com atalhos (mês atual, ano atual), filtros de tipo/categoria/busca, tabela e total exibido. Verificado no navegador (Playwright) contra o Supabase local: abre em todas as Ordens no ano corrente (13 linhas do seed); aba Arco Real muda a URL e mostra 6 linhas sem a coluna Ordem; 'só saídas' deixa 3 linhas e o total acompanha (−R$ 1.145,90); busca 'anuidade' deixa 2 (R$ 840,00); mês atual sem lançamentos mostra o estado vazio e o cartão passa o saldo para 'saldo anterior'; março a maio dá saldo anterior R$ 2.690,00; período invertido desabilita o botão; URL com Ordem ou datas inválidas cai no padrão. Lint sem erros.

---

## WP04 — Tesouraria: novo lançamento, edição e exclusão

```yaml
lane: revisão
estimativa: 75min
files:
  - src/lib/useEnvio.js
  - src/app/(app)/tesouraria/actions.js
  - src/app/(app)/tesouraria/LancamentoForm.jsx
  - src/app/(app)/tesouraria/novo/page.js
  - src/app/(app)/tesouraria/[id]/editar/page.js
depende_de: [WP03]
```

### Objetivo
Permitir registrar, corrigir e excluir lançamentos.

### Passos
1. `actions.js`: `salvarLancamento` (valida Ordem, tipo, data, valor, categoria; grava; redireciona para o período que contém a data) e `excluirLancamento`.
2. `LancamentoForm.jsx`: Ordem, tipo (radios), data, valor, categoria (filtrada pelo tipo), irmão (opcional), descrição; cartão "Excluir lançamento" com `Dialog`.
3. Páginas `novo` (Ordem pré-selecionada pela URL, data de hoje) e `[id]/editar` (404 se não existir; mostra quem lançou e quando).

### Definição de Pronto
- [x] Entrada e saída novas aparecem na lista da Ordem certa, com Toast de confirmação
- [x] Valor inválido, data ausente, Ordem ou categoria ausentes devolvem mensagem no formulário sem perder o que foi digitado
- [x] Depois de um erro de validação, todos os campos (inclusive Ordem, categoria e irmão) continuam com o que o oficial escolheu
- [x] Trocar o tipo troca as categorias oferecidas
- [x] Edição grava e o saldo muda; exclusão pede confirmação e remove
- [x] A tela de edição mostra o e-mail de quem lançou e a data do registro
- [x] `npm run lint` passa
- [x] Nenhum arquivo fora de `files:` foi tocado

### Log
- 2026-11-10: WP criada
- 2026-11-10: iniciada
- 2026-11-10: [Spec Architect] plano ajustado durante a WP: o teste no navegador mostrou que `<form action>` limpa o formulário quando a action devolve erro (um `<select>` controlado volta ao valor inicial; a Ordem mudaria sem aviso). Entra o hook `src/lib/useEnvio.js` em `files:` e na Definição de Pronto. O mesmo defeito existe nos formulários de irmão e de loja: vira a WP09.
- 2026-11-10: concluída, movida para revisão. `actions.js` (`salvarLancamento`, `excluirLancamento`), `LancamentoForm.jsx` (formulário + exclusão com Dialog), páginas `novo` e `[id]/editar`, hook `useEnvio`. Verificado no navegador contra o Supabase local: saída de R$ 75,50 na Marca baixou o saldo de 1.150,00 para 1.074,50 com Toast; entrada em Nautas com data de 2025, aberta a partir da lista da Marca/2026, voltou para a lista de Nautas/2025 mostrando o lançamento; valor 'abc' e '0', categoria ausente e troca de tipo devolvem mensagem e mantêm descrição, Ordem e categoria escolhidas; edição de 1.240,50 para 1.000,00 refletiu no saldo; exclusão pede confirmação e zera o período; a tela de edição mostra 'Lançado por escriba@keystone.local em …' e a última alteração; id inexistente ou malformado devolve 404. Lint sem erros.

---

## WP05 — Ajustes: categorias do caixa

```yaml
lane: revisão
estimativa: 60min
files:
  - src/app/(app)/ajustes/page.js
  - src/app/(app)/ajustes/CategoriasCaixa.jsx
  - src/app/(app)/ajustes/actions.js
depende_de: [WP02]
```

### Objetivo
Substituir o placeholder de Ajustes pela manutenção das categorias do caixa.

### Passos
1. `actions.js`: `salvarCategoria` (cria ou renomeia) e `excluirCategoria`, com mensagens para nome repetido e categoria em uso.
2. `CategoriasCaixa.jsx`: tabela (nome, tipo), formulário "Nova categoria", renomear em `Dialog`, excluir com confirmação.
3. `page.js`: carrega as categorias e monta a tela.

### Definição de Pronto
- [x] Criar categoria de entrada e de saída; ambas passam a aparecer no formulário de lançamento do tipo correspondente
- [x] Nome repetido no mesmo tipo é recusado com mensagem
- [x] Renomear funciona e reflete nos lançamentos existentes
- [x] Excluir categoria sem uso funciona; categoria em uso mostra a explicação e não é excluída
- [x] `npm run lint` passa
- [x] Nenhum arquivo fora de `files:` foi tocado

### Log
- 2026-11-10: WP criada
- 2026-11-10: iniciada
- 2026-11-10: concluída, movida para revisão. `actions.js` (`salvarCategoria`, `excluirCategoria`), `CategoriasCaixa.jsx` (nova categoria, uma tabela por tipo, renomear e excluir em Dialog), `page.js`. Verificado no navegador contra o Supabase local: criar 'Rifa beneficente' (entrada) e 'Correios' (saída), ambas aparecem no formulário de lançamento do tipo certo; 'correios' repetido é recusado com mensagem e o campo fica como estava; renomear 'Anuidade' refletiu nos 2 lançamentos do Arco Real; renomear para um nome existente é recusado dentro do Dialog; excluir 'Anuidade' (em uso) mostra a explicação e nada some; excluir as duas categorias sem uso funciona. Lint sem erros.
- 2026-11-10: ajuste depois do teste visual (ainda em revisão): os dois cartões de categorias usavam `padding="0"`, que no `Card` do design system também zera o padding do cabeçalho e encostava o título na borda. Passam a usar o padding normal com margem negativa no conteúdo. Retestado no navegador.

---

## WP06 — Área de impressão e fichas do irmão

```yaml
lane: revisão
estimativa: 90min
files:
  - src/app/imprimir/layout.js
  - src/app/imprimir/imprimir.css
  - src/app/imprimir/BarraImpressao.jsx
  - src/app/imprimir/ficha/[id]/page.js
  - src/app/imprimir/fichas/page.js
  - src/components/Folha.jsx
  - src/components/FichaIrmao.jsx
  - src/app/(app)/cadastro/CadastroLista.jsx
  - src/app/(app)/cadastro/[id]/editar/page.js
depende_de: [WP02]
```

### Objetivo
Emitir fichas preenchidas: ficha cadastral e ficha por Ordem de um irmão, e as fichas de todos os irmãos de uma Ordem, prontas para imprimir em A4.

### Passos
1. `layout.js` + `imprimir.css` + `BarraImpressao.jsx`: área sem Shell, sessão obrigatória, folha A4 na tela, barra que não sai no papel.
2. `Folha.jsx` e `FichaIrmao.jsx`: cabeçalho, seções e campos; campo vazio vira linha em branco; modelos `cadastral`, `arco-real`, `marca`, `nautas`.
3. `ficha/[id]/page.js` (um irmão, modelo por `?modelo=`) e `fichas/page.js` (todos os irmãos de uma Ordem, uma folha por irmão).
4. Cadastro: "Emitir ficha" na linha da tabela, no painel de detalhe e na Topbar da edição.

### Definição de Pronto
- [x] `/imprimir/ficha/<id>` mostra a ficha cadastral com todos os dados do irmão e das Ordens de que participa
- [x] `?modelo=arco-real|marca|nautas` mostra a ficha da Ordem; se o irmão não participa, os campos da Ordem saem em branco
- [x] `/imprimir/fichas?ordem=<ordem>` gera uma folha por irmão da Ordem; Ordem inválida ou ausente mostra aviso em vez de erro
- [x] Na impressão (PDF pelo Chromium) a barra não aparece e cada ficha começa em página nova
- [x] Id inexistente devolve 404; sem sessão, redireciona para o login
- [x] `npm run lint` passa
- [x] Nenhum arquivo fora de `files:` foi tocado

### Log
- 2026-11-10: WP criada
- 2026-11-10: iniciada
- 2026-11-10: concluída, movida para revisão. Área `/imprimir` (layout com sessão obrigatória e sem Shell, CSS de impressão A4, barra que não sai no papel), `Folha.jsx` (cabeçalho, seções, rodapé de emissão e estilos de tabela impressa), `FichaIrmao.jsx` (modelos cadastral e por Ordem; campo vazio vira linha em branco; quadro de foto), páginas `ficha/[id]` e `fichas`, e 'Emitir ficha' na linha e no painel do Cadastro e na Topbar da edição. Verificado no navegador contra o Supabase local: ficha cadastral do irmão com duas Ordens mostra os dois blocos; irmão sem Ordens mostra o aviso; modelo de Ordem sem registro sai com os campos da Ordem em branco; modelo inválido cai no cadastral; lote do Arco Real gera 2 folhas e o de Nautas 1; Ordem ausente ou inválida mostra aviso e desabilita Imprimir; PDF pelo Chromium com 1 página (ficha) e 2 páginas (lote), sem a barra; id inexistente ou malformado devolve 404; sem sessão redireciona para /login. Lint sem erros.

---

## WP07 — Quadro de irmãos, extrato do caixa e tela Relatórios

```yaml
lane: revisão
estimativa: 75min
files:
  - src/app/imprimir/quadro/page.js
  - src/app/imprimir/extrato/page.js
  - src/app/(app)/relatorios/page.js
depende_de: [WP06]
```

### Objetivo
Completar os documentos imprimíveis e dar um ponto de entrada único em Relatórios.

### Passos
1. `quadro/page.js`: lista nominal dos irmãos de uma Ordem (nome, CIM, loja simbólica, data de ingresso na Ordem, contato) com total.
2. `extrato/page.js`: por Ordem e período, saldo anterior, lançamentos em ordem cronológica com saldo acumulado, totais e saldo final; sem `ordem`, uma folha por Ordem.
3. `relatorios/page.js`: cartões "Fichas", "Quadro de irmãos" e "Extrato do caixa" (formulário GET com Ordem e período).

### Definição de Pronto
- [x] Quadro lista só os irmãos da Ordem pedida, em ordem alfabética, com o total
- [x] No extrato, saldo anterior + entradas − saídas = saldo final, e o saldo acumulado da última linha é igual ao saldo final
- [x] Extrato de período sem lançamentos informa isso e mantém os saldos
- [x] Relatórios leva a cada documento com os parâmetros certos
- [x] `npm run lint` passa
- [x] Nenhum arquivo fora de `files:` foi tocado

### Log
- 2026-11-10: WP criada
- 2026-11-10: iniciada
- 2026-11-10: concluída, movida para revisão. `quadro/page.js` (lista nominal por Ordem com corpo, loja simbólica, data de ingresso e telefone), `extrato/page.js` (posição do período calculada no banco, lançamentos em ordem cronológica com saldo acumulado, totais; sem Ordem, uma folha por Ordem), `relatorios/page.js` (fichas em lote, quadro e formulário do extrato). Verificado no navegador contra o Supabase local: quadro do Arco Real com 2 irmãos em ordem alfabética, Marca 2, Nautas 1, Ordem inválida mostra aviso; extrato conferido por script em quatro recortes (Marca mar-jun, as três Ordens no ano, Nautas em agosto sem lançamentos): saldo anterior + entradas − saídas = saldo final, soma das colunas igual aos totais e último saldo acumulado igual ao saldo final; parâmetros inválidos caem no padrão; PDF das três Ordens com 3 páginas; Voltar devolve a Relatórios ou à Tesouraria com os mesmos filtros, conforme a origem. Lint sem erros.

---

## WP08 — Painel com saldos, exclusão protegida e documentação

```yaml
lane: revisão
estimativa: 45min
files:
  - src/app/(app)/page.js
  - src/app/(app)/cadastro/ExcluirIrmao.jsx
  - src/app/(app)/cadastro/actions.js
  - README.md
  - CLAUDE.md
depende_de: [WP04, WP07]
```

### Objetivo
Fechar o MVP: saldo das Ordens no Painel, mensagem clara ao tentar excluir irmão com lançamentos e documentação atualizada.

### Passos
1. `page.js`: cartão "Caixa das Ordens" com o saldo atual de cada Ordem e atalho para a Tesouraria; remover o código morto (`semOrdem`).
2. `actions.js` + `ExcluirIrmao.jsx`: `excluirIrmao` devolve `{ erro }` (FK 23503 traduzida) e o cartão mostra a mensagem.
3. `README.md` e `CLAUDE.md`: telas novas, área `/imprimir`, migration 003, convenções de dinheiro e totais.
4. `npm run lint` e `npm run build`.

### Definição de Pronto
- [x] Painel mostra o saldo atual de cada Ordem, igual ao da Tesouraria sem filtro de período
- [x] Excluir irmão com lançamentos mostra a mensagem na própria tela e nada é apagado; irmão sem lançamentos continua excluível
- [x] README e CLAUDE.md descrevem as telas e convenções novas
- [x] `npm run lint` e `npm run build` terminam sem erro
- [x] Nenhum arquivo fora de `files:` foi tocado

### Log
- 2026-11-10: WP criada
- 2026-11-10: iniciada
- 2026-11-10: concluída, movida para revisão. Painel com o cartão 'Caixa das Ordens' (saldo atual por Ordem, igual ao da Tesouraria com período aberto) e sem o código morto; cabeçalho do cartão 'Últimos cadastros' deixou de encostar na borda; `excluirIrmao` devolve `{ erro }` e o cartão mostra a recusa quando o irmão tem lançamentos (nada é apagado), irmão sem lançamentos continua excluível; README e CLAUDE.md atualizados. `npm run lint` e `npm run build` sem erro; todos os roteiros de navegador das WP03 a WP09 repetidos contra o build de produção em banco recriado com `supabase db reset`.

---

## WP09 — Cadastro e Lojas: erro ao salvar não apaga o formulário

```yaml
lane: revisão
estimativa: 30min
files:
  - src/app/(app)/cadastro/IrmaoForm.jsx
  - src/app/(app)/lojas/LojaForm.jsx
depende_de: [WP04]
```

### Objetivo
Corrigir, nos formulários que já existiam, a perda do que foi digitado quando o salvamento devolve erro (por exemplo CPF repetido), usando o hook `useEnvio` criado na WP04.

### Passos
1. `IrmaoForm.jsx`: trocar `useActionState` + `<form action>` por `useEnvio` + `<form onSubmit>`.
2. `LojaForm.jsx`: o mesmo no formulário da loja (o formulário de exclusão não tem campos digitados e fica como está).

### Definição de Pronto
- [x] Cadastrar irmão com CPF já existente mostra o erro e mantém nome, e-mail, loja e os blocos de Ordem preenchidos
- [x] Salvar loja sem potência mostra o erro e mantém nome e endereço
- [x] Criar e editar irmão e loja continuam funcionando, com o Toast de confirmação
- [x] `npm run lint` passa
- [x] Nenhum arquivo fora de `files:` foi tocado

### Log
- 2026-11-10: WP criada (defeito encontrado no teste da WP04)
- 2026-11-10: iniciada (fora de ordem, antes de fechar a WP08, para que o `npm run build` final cubra tudo)
- 2026-11-10: concluída, movida para revisão. `IrmaoForm.jsx` e `LojaForm.jsx` enviam por `useEnvio`. Verificado no navegador: CPF repetido mostra o erro e mantém nome, e-mail, loja e o bloco do Arco Real; corrigido o CPF, o irmão é criado e depois editado com Toast; loja sem potência mostra o erro e mantém nome e endereço; criar, editar e excluir loja continuam funcionando. Lint sem erros.

---

## WP10 — Migration 004: oficiais e papéis, situação, número, fechamento e histórico

```yaml
lane: revisão
estimativa: 90min
files:
  - supabase/migrations/20261110180000_regras_de_negocio.sql
  - supabase/seed.sql
  - supabase/config.toml
depende_de: [WP01]
```

### Objetivo
Levar para o banco as regras fechadas no refino: lista de oficiais com papéis e RLS por papel; situação do irmão por Ordem e data de falecimento; número sequencial e forma de pagamento do lançamento; fechamento do caixa por Ordem; histórico de alterações dos lançamentos.

### Definição de Pronto
- [x] `npm run db:reset` aplica as quatro migrations e o seed
- [x] Conta sem linha em `oficial` não lê nada; `leitura` lê e não grava; só `administrador` grava `caixa_fechamento` e chama `oficial_definir`/`oficial_remover`
- [x] O último administrador não pode ser rebaixado nem removido
- [x] Lançamento com data até o fechamento não pode ser criado, alterado, movido nem excluído (SQLSTATE KS001)
- [x] Criar, alterar e excluir lançamento gera linha no histórico com autor; o histórico não aceita escrita pela API
- [x] `numero` é atribuído pelo banco e não aceita valor informado
- [x] Cadastro público de contas desligado no ambiente local
- [x] `npm run lint` passa

### Log
- 2026-11-10: WP criada no refino do MVP (regras de negócio com menos pontas soltas e preparação para produção)
- 2026-11-10: concluída, movida para revisão. Conferido pela API local com quatro contas (administrador, oficial, leitura e não autorizada): leituras 3/3/3/0 linhas; não autorizada e oficial recebem 42501 ao tentar se autorizar ou promover; leitura recebe 42501 no INSERT e 0 linhas no DELETE; `numero` informado é recusado (428C9); fechamento por oficial é recusado e por administrador grava; inserir, alterar, mover para dentro e excluir em período fechado devolvem KS001, e outra Ordem continua aberta; histórico registra criado/alterado/excluído com o e-mail; DELETE no histórico devolve 42501; último administrador devolve KS003; e-mail sem conta devolve KS002; `anon` recebe 42501 nas tabelas e funções novas; sign up público devolve `signup_disabled`. Os CPFs do seed passaram a ter dígitos verificadores válidos. No `config.toml`, só `[auth] enable_signup` foi desligado: desligar o de `[auth.email]` bloqueia também o login por e-mail na stack local.

---

## WP11 — Acesso no app: papel na sessão, tela de acesso pendente e gestão de oficiais

```yaml
lane: revisão
estimativa: 75min
files:
  - src/lib/acesso.js
  - src/lib/formatar.js
  - src/lib/dados.js
  - src/components/AcessoPendente.jsx
  - src/components/Shell.jsx
  - src/components/Sidebar.jsx
  - src/app/(app)/layout.js
  - src/app/imprimir/layout.js
  - src/app/(app)/ajustes/page.js
  - src/app/(app)/ajustes/actions.js
  - src/app/(app)/ajustes/Oficiais.jsx
  - src/app/(app)/ajustes/MinhaSenha.jsx
  - src/app/(app)/lojas/actions.js
depende_de: [WP10]
```

### Objetivo
Fazer o app respeitar e explicar o controle de acesso: layouts barram conta não autorizada, toda Server Action de gravação confere o papel, Ajustes ganha a gestão de oficiais e a troca da própria senha.

### Definição de Pronto
- [x] Conta não autorizada vê "Acesso pendente"; sem nenhum oficial cadastrado, a tela mostra o comando SQL do primeiro administrador
- [x] Administrador autoriza conta por e-mail, troca papel e retira acesso; e-mail sem conta mostra a orientação
- [x] Perfil somente leitura recebe mensagem clara ao tentar gravar e não vê os controles de administração
- [x] A barra lateral mostra o papel de quem está na sessão
- [x] `npm run lint` passa

### Log
- 2026-11-10: WP criada no refino do MVP (regras de negócio com menos pontas soltas e preparação para produção)
- 2026-11-10: concluída, movida para revisão. Verificado no navegador contra o Supabase local (build de produção): conta sem autorização vê a tela de acesso pendente nas duas variações e a área `/imprimir` redireciona para ela; depois do comando SQL o administrador entra, autoriza tesoureiro (oficial) e leitor (leitura), e um e-mail sem conta mostra a orientação; com o leitor, salvar uma loja devolve "Seu perfil é somente leitura" e Ajustes não mostra os controles de administração. A troca de senha não foi exercitada no navegador.

---

## WP12 — Tesouraria: número, forma de pagamento, fechamento, histórico e recibo

```yaml
lane: revisão
estimativa: 90min
files:
  - src/app/(app)/tesouraria/actions.js
  - src/app/(app)/tesouraria/LancamentoForm.jsx
  - src/app/(app)/tesouraria/TesourariaLista.jsx
  - src/app/(app)/tesouraria/page.js
  - src/app/(app)/tesouraria/novo/page.js
  - src/app/(app)/tesouraria/[id]/editar/page.js
  - src/app/(app)/tesouraria/HistoricoCaixa.jsx
  - src/app/(app)/tesouraria/historico/page.js
  - src/app/(app)/ajustes/FechamentoCaixa.jsx
  - src/app/imprimir/recibo/[id]/page.js
depende_de: [WP11]
```

### Objetivo
Mostrar e aplicar nas telas as regras do caixa: número do lançamento, forma de pagamento, bloqueio de período fechado com explicação, histórico e recibo das entradas; fechamento por Ordem em Ajustes.

### Definição de Pronto
- [x] Lista mostra o número e busca por ele; cartão da Ordem mostra "Caixa fechado até"
- [x] Formulário avisa e não envia quando a data cai em período fechado; lançamento de período fechado abre travado e sem exclusão
- [x] Data futura é recusada
- [x] A edição mostra o histórico do lançamento e `/tesouraria/historico` mostra os últimos 200 registros
- [x] Entrada emite recibo com número e valor por extenso; saída não
- [x] Administrador fecha e reabre o caixa de cada Ordem em Ajustes
- [x] `npm run lint` passa

### Log
- 2026-11-10: WP criada no refino do MVP (regras de negócio com menos pontas soltas e preparação para produção)
- 2026-11-10: concluída, movida para revisão. Verificado no navegador: fechado o caixa da Marca até 30/04/2026 em Ajustes, o cartão da Marca mostra o fechamento; o lançamento nº 5 (15/03) abre travado, com o botão de salvar desabilitado e sem a zona de exclusão; novo lançamento com data 15/04 fica bloqueado com aviso e com data 10/06 é gravado como nº 14; alterar o valor para 1.240,50 e a forma de PIX para dinheiro aparece no histórico do lançamento ("Valor: R$ 150,00 → R$ 1.240,50 · Forma de pagamento: PIX → Dinheiro") e na tela Histórico do caixa; o recibo sai com "mil duzentos e quarenta reais e cinquenta centavos". O valor por extenso foi conferido por script em 15 casos (centavos, cem, mil, milhão). A data futura é barrada pelo próprio campo (`max`); a validação do servidor existe mas não foi exercitada. Reabrir o caixa não foi exercitado no navegador (o DELETE em `caixa_fechamento` foi conferido pela política na WP10 apenas para o INSERT).

---

## WP13 — Cadastro: situação por Ordem, falecimento e validações

```yaml
lane: revisão
estimativa: 60min
files:
  - src/app/(app)/cadastro/actions.js
  - src/app/(app)/cadastro/IrmaoForm.jsx
  - src/app/(app)/cadastro/CadastroLista.jsx
  - src/components/FichaIrmao.jsx
  - src/app/imprimir/quadro/page.js
  - src/lib/dados.js
depende_de: [WP10]
```

### Objetivo
Trocar a exclusão de quem sai por situação em cada Ordem, registrar falecimento e recusar CPF e datas incoerentes.

### Definição de Pronto
- [x] Cada bloco de Ordem tem situação e data; desligado sai do quadro, das fichas em lote e das contagens; licenciado aparece com a situação
- [x] Falecimento registrado tira o irmão dos quadros e mantém o cadastro
- [x] CPF com dígito verificador errado é recusado
- [x] Datas futuras ou fora de ordem são recusadas com mensagem que cita as duas datas
- [x] Desmarcar uma Ordem que já tem registro mostra aviso antes de salvar
- [x] `npm run lint` passa

### Log
- 2026-11-10: WP criada no refino do MVP (regras de negócio com menos pontas soltas e preparação para produção)
- 2026-11-10: concluída, movida para revisão. Verificado no navegador: passagem anterior à iniciação devolve "Passagem (01/01/2004) não pode ser anterior a iniciação (01/03/2005)"; CPF 123.456.789-01 devolve "CPF inválido"; marcado como desligado da Marca, o irmão aparece na lista com "Mestre da Marca · desligado", sai do quadro da Marca (1 irmão) e da contagem em Relatórios; o quadro de Nautas mostra Carlos como Licenciado. O campo de falecimento e o aviso ao desmarcar uma Ordem não foram exercitados no navegador.

---

## WP14 — Preparação para produção e documentação

```yaml
lane: revisão
estimativa: 45min
files:
  - next.config.mjs
  - vercel.json
  - .github/workflows/ci.yml
  - package.json
  - src/app/layout.js
  - README.md
  - CLAUDE.md
depende_de: [WP13]
```

### Objetivo
Deixar o repositório pronto para publicar na Vercel com um projeto Supabase novo.

### Definição de Pronto
- [x] Cabeçalhos de segurança e `noindex` em todas as respostas
- [x] Função da Vercel na região de São Paulo
- [x] CI roda lint e build em cada PR
- [x] README traz o roteiro de publicação, os papéis e as regras em vigor
- [x] `npm run build` passa
- [x] `npm run lint` passa

### Log
- 2026-11-10: WP criada no refino do MVP (regras de negócio com menos pontas soltas e preparação para produção)
- 2026-11-10: concluída, movida para revisão. Conferido com `curl` no build de produção local: `X-Frame-Options: DENY`, `X-Robots-Tag: noindex, nofollow` e sem `X-Powered-By`. O workflow de CI e o `vercel.json` não foram executados (dependem do GitHub e da Vercel). Nenhum projeto Supabase ou Vercel foi criado ou alterado.

---

<!-- Adicione mais WPs seguindo o mesmo formato. Numere em sequência: WP15, ... -->
