# Ordens Inglesas — Design System

Sistema de design para uma **plataforma interna de controle de cadastro, admissão e financeiro** das Ordens Inglesas no Brasil: **Arco Real**, **Mestre Maçom da Marca** e **Nautas da Arca Real**. É um produto administrativo, usado por oficiais (Escriba, Tesoureiro, Secretário) para manter registros de irmãos, conduzir processos de admissão/exaltação e controlar anuidades e taxas.

## Fontes recebidas

| Fonte | O que forneceu |
| --- | --- |
| `uploads/keystone.jpg` (copiado para `assets/keystone.jpg`) | Ilustração em traço da **chave de abóbada** com as letras H.T.W.S.S.T.K.S. — único ativo gráfico fornecido. |
| Descrição do produto (texto do briefing) | Escopo funcional: cadastro, admissão e financeiro; as três Ordens atendidas. |

Nenhum código-fonte, arquivo Figma, deck ou arquivo de fonte tipográfica foi fornecido. **Não havia logotipo**: a assinatura da marca é composta tipograficamente (EB Garamond) ao lado da chave de abóbada — nenhum logotipo foi desenhado ou reconstruído. Tudo em cor, tipo, espaçamento e componentes abaixo foi definido nesta rodada a partir do contexto cerimonial das Ordens e das necessidades de um sistema de registro/financeiro; **tudo é revisável**.

## Índice

- `styles.css` — ponto de entrada único para consumidores (só `@import`).
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `shape.css`, `motion.css`, `semantic.css`, `base.css`.
- `guidelines/` — cartões-espécime das fundações (Colors, Type, Spacing, Brand).
- `components/` — primitivas React (abaixo).
- `ui_kits/plataforma/` — recriação clicável do produto (`README.md` próprio).
- `assets/keystone.jpg` — emblema da chave de abóbada.
- `thumbnail.html`, `SKILL.md`.

### Componentes

| Grupo | Componentes |
| --- | --- |
| `components/core/` | **Button**, **IconButton**, **Card**, **Badge**, **Tag**, **Icon** |
| `components/forms/` | **Input**, **Select**, **Checkbox**, **Radio**, **Switch** |
| `components/navigation/` | **Tabs** |
| `components/feedback/` | **Dialog**, **Toast**, **Tooltip** |
| `components/data/` | **DataTable** (+ **RowActions**, **SortMark**) |

**Adições intencionais** (nenhuma fonte definia inventário de componentes, então o conjunto padrão foi autorado):
- **Icon** — invólucro para o conjunto Lucide, para que nenhum SVG seja desenhado à mão.
- **DataTable / RowActions / SortMark** — a plataforma é essencialmente listas de registros; sem tabela o sistema não cobre o produto.

## CONTENT FUNDAMENTALS

**Idioma:** português do Brasil, sempre. Termos ritualísticos preservam a grafia consagrada: *Capítulo*, *Arca*, *Loja*, *Escriba*, *Tesoureiro*, *Companheiro exaltado*, *Mestre da Marca*, *Comandante Nauta*, *exaltação*, *quitação*, *anuidade*, *joia*.

**Pessoa e tom.** A interface fala com o oficial em **você**, de forma sóbria e institucional — nunca coloquial, nunca efusiva. O sistema não se refere a si mesmo em primeira pessoa ("nós"); relata fatos. Correto: "Use a matrícula do seu Capítulo ou Arca." Evitar: "Vamos começar! 🎉".

**Caixa.** Títulos e rótulos em **sentence case** ("Cadastro de irmãos", "Novo lançamento"). VERSAL só em versaletes de apoio (`.eyebrow`) e cabeçalhos de tabela, sempre com tracking 0.14em. Nunca title case à inglesa.

**Rótulos de ação:** verbo no infinitivo + objeto — "Aprovar admissão", "Enviar avisos", "Novo lançamento", "Emitir recibo". Um botão, um ato.

**Estados:** uma palavra, VERSAL, sem ponto — *Quite*, *Pendente*, *Vencido*, *Em análise*, *Arquivado*, *Aprovado*.

**Mensagens.** Uma frase, ponto final, causa antes de consequência: "Documentação incompleta — falta o atestado da Loja simbólica." Confirmações relatam o que ficou registrado: "Anuidade quitada. Recibo 2026/0184 enviado por e-mail."

**Números e datas.** Data `dd/mm/aaaa`; dinheiro `R$ 1.240,00` (vírgula decimal, ponto de milhar); matrícula `AR-2026-0184` (prefixo da Ordem + exercício + sequencial). Sempre em algarismos tabulares (`.numeric`).

**Vazio e discrição.** Estados vazios são factuais: "Nenhum irmão encontrado com esses critérios." Quando algo não foi especificado, a tela diz isso em vez de inventar: "Sem especificação recebida."

**Emoji: nunca.** Nem em interface, nem em e-mail, nem em rótulo. O único símbolo decorativo permitido é o losango de 5px que marca a Ordem em `Tag`.

## VISUAL FOUNDATIONS

**Vibe.** Papel de arquivo e tinta: um livro de registros bem impresso, não um SaaS. Nada de brilho, nada de gradientes de marca, nada de ilustração vetorial. A dignidade vem da tipografia serifada, da largura generosa das margens e do uso disciplinado de duas cores cerimoniais.

**Cor.** Neutros levemente quentes (papel `--neutral-25` #faf8f4, tinta `--neutral-900`). Três cores cerimoniais fixas, uma por Ordem: **carmim** `--crimson-500` (Arco Real), **ouro** `--gold-500` (Mestre da Marca), **azul-marinho** `--navy-500` (Nautas). O azul-marinho é também a cor funcional da interface (ação primária, navegação, foco); o carmim é reservado ao ato consequente (aprovar, exaltar) e à aba ativa; o ouro é ornamento (réguas, selos, marcadores em fundo escuro) e **nunca** cor de texto sobre branco em corpo pequeno. Máximo de dois fundos por tela: papel (`--surface-page`) e navy (`--surface-navy`).

**Tipografia.** Display **EB Garamond** (títulos, nomes de Ordens, números cerimoniais) + corpo **IBM Plex Sans** (toda a interface) + **IBM Plex Mono** para valores, datas e matrículas com algarismos tabulares. Escala 11→58px, razão ~1.22. Line-height 1.12 em display, 1.5 em corpo. Tracking negativo leve (-0.01em) só no display; 0.14em nos versaletes.

**Espaçamento e layout.** Base 4px; 16 e 24 fazem quase todo o trabalho. Sidebar fixa de 264px (navy, rolagem própria), topbar fixa de 60px (papel branco com filete inferior), conteúdo com padding 24 e largura máxima 1180; formulários no máximo 640. Painel de detalhe entra como coluna fixa de 380px à direita, não como modal. Nada de layout centralizado em telas de trabalho — listas ocupam a largura.

**Fundos e imagem.** Sem fotografia no produto. O único recurso pictórico é a chave de abóbada, aplicada como **marca-d'água a 6–8% de opacidade** (invertida, `mix-blend-mode: screen`) em fundos navy — login, sidebar e cabeçalhos cerimoniais. Sem padrões repetidos, sem texturas, sem gradientes de marca. Se um dia entrar fotografia, deve ser fria, de baixo contraste e monocromática.

**Cantos.** Discretos: 2px em filetes e `Tag`, 4px em botões e campos, 6px em cartões, 8px em modais. Pílula (999px) **só** em `Badge` e barras de proporção. Nada de cantos grandes.

**Cartões.** Papel branco, filete de 1px `--neutral-200`, raio 6px, `--shadow-1`. Cabeçalho opcional com versalete + título display e divisória de 1px. Quando o cartão pertence a uma Ordem, recebe **régua superior de 2px** na cor da Ordem — nunca borda lateral colorida. O único acento à esquerda no sistema é o filete de 3px do `Toast`.

**Sombras.** Curtas e frias, quase impressas: `--shadow-1` (conteúdo e botões), `--shadow-2` (menus, Toast), `--shadow-3` (Dialog). Sem sombra interna decorativa; `--shadow-inset` existe apenas para superfícies claras empilhadas. Sombras nunca substituem filete — os dois andam juntos.

**Bordas e réguas.** `--border-hairline` (neutral-200) estrutura tudo; `--border-strong` (neutral-300) delimita controles; `--rule-ornament` (ouro 1px) aparece só em cabeçalho cerimonial e na assinatura da marca; 2px carmim marca aba ativa e topo de cartão.

**Estados.** *Hover*: fundo mais escuro em superfície clara (`--surface-hover`) e mais claro em navy (branco a 5–10%); links trocam navy por carmim. *Press*: o botão desce 1px (`translateY(1px)`) e perde a sombra — sem `scale`. *Foco*: borda navy + anel de 3px navy 22% (`--focus-ring`), sempre visível, nunca removido. *Selecionado*: linha de tabela em `--surface-selected` (navy-50); item de menu com filete ouro de 2px à esquerda. *Desabilitado*: fundo neutral-100, texto neutral-400, cursor `not-allowed`, sem sombra.

**Movimento.** Curto e sóbrio: 80ms instantâneo, **140ms padrão**, 220ms para painéis, 360ms no máximo. Easing `cubic-bezier(.2,.6,.2,1)`. Fades e deslocamentos de poucos pixels; **sem bounce, sem elástico, sem spring, sem animação de entrada em listas**. Tooltip aparece por opacidade em 140ms.

**Transparência e blur.** Praticamente ausentes. Duas exceções: o scrim do `Dialog` (`rgba(20,19,17,.42)` com `blur(2px)`) e as camadas brancas a 5–10% na sidebar navy. Nada de vidro fosco em cartões nem gradiente de proteção — o texto sobre navy é sólido e não precisa disso.

**Tabelas.** Sem zebra: apenas filetes de 1px `--border-subtle` entre linhas, cabeçalho em versaletes, coluna identificadora em `--text-strong`/500, dinheiro e datas à direita em mono tabular, ações à direita em `IconButton` fantasma que só ganha fundo no hover da célula.

## ICONOGRAPHY

**Nenhum ícone foi fornecido.** Substituição adotada e sinalizada: **Lucide** (traço 1.75px, cantos arredondados, grade 24px). Os 38 glifos usados no produto estão **embutidos como caminhos SVG em `components/core/Icon.jsx`** (extraídos de `lucide-static@0.544.0`), pintam de forma síncrona, sem rede, e herdam `currentColor` — nunca se desenha SVG à mão no sistema. `ICON_NAMES` lista o conjunto; para um glifo novo, acrescente o caminho do Lucide em `Icon.jsx`.

- **Escada de tamanhos:** 14px inline em texto, **16px padrão** de interface, 20px em navegação, 24px em cabeçalho.
- **Cor:** herda do texto. Ícone colorido só em `Badge`/`Toast`, pela cor semântica.
- **Vocabulário fixo:** `users-round` (cadastro), `scroll-text` (admissões), `receipt-text` (tesouraria/recibo), `layout-dashboard` (painel), `building-2` (Capítulos e Arcas), `chart-no-axes-column` (relatórios), `award` (graus), `id-card` (matrícula), `paperclip` (documentos), `printer` (ficha), `funnel` (filtros), `search`, `plus`, `check`, `x`, `chevron-*`, `bell`, `settings`, `log-out`.
- **Sem fonte de ícone, sem sprite, sem PNG.** Emoji nunca. Caracteres Unicode como ícone nunca; o único glifo decorativo é o losango de 5px da `Tag` (quadrado rotacionado em CSS).
- **Emblema:** `assets/keystone.jpg` é ilustração de marca, não ícone — não use em botões nem em linhas de tabela.

## Pendências para o cliente

1. **Fontes:** não recebemos arquivos. EB Garamond, IBM Plex Sans e IBM Plex Mono vêm do Google Fonts como substitutos — envie os arquivos oficiais se houver.
2. **Logotipo:** não recebemos marca. A assinatura é tipográfica; confirme se existe brasão/logotipo oficial de cada Ordem.
3. **Ícones:** conjunto Lucide substituto.
4. **Cores cerimoniais:** carmim/ouro/navy foram inferidos das cores tradicionais de cada Ordem; confirme os valores exatos usados em regalia e papelaria.
