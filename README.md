# Keystone · Plataforma das Ordens Inglesas

Plataforma interna de **cadastro de irmãos, lojas simbólicas e registros de Arco Real, Mestre Maçom da Marca e Nautas da Arca Real**, com **emissão de fichas preenchidas** e **caixa de cada Ordem**. Usada por oficiais (Escriba, Tesoureiro, Secretário).

> **MVP em avaliação.** Várias regras de negócio ainda estão em aberto e o sistema adota um comportamento provisório para cada uma. A lista está em [`.claude/specs/current/002-mvp-fichas-e-caixa/spec.html`](.claude/specs/current/002-mvp-fichas-e-caixa/spec.html), seção "Precisa esclarecer" (abra o arquivo no navegador).

- **Front-end:** Next.js (App Router, JavaScript/JSX) hospedado na **Vercel**
- **Banco e autenticação:** **Supabase** (Postgres + Auth), com RLS ligado
- **Design system:** "Ordens Inglesas" (Claude Design), vendorizado em `src/ds/`
- **Licença:** GPL-3.0 (`LICENSE`)

## Telas

| Rota | O que faz |
| --- | --- |
| `/login` | Entrada por e-mail e senha (Supabase Auth) |
| `/` | Painel: contagens por Ordem e por loja, últimos cadastros |
| `/cadastro` | Lista de irmãos com busca (nome, CPF, CIM) e filtros; painel de detalhe |
| `/cadastro/novo`, `/cadastro/[id]/editar` | Formulário completo (dados básicos, loja, datas simbólicas, Arco Real, Marca, Nauta) e exclusão |
| `/lojas`, `/lojas/nova`, `/lojas/[id]/editar` | Lojas simbólicas (GOB, CMSB, COMAB) |
| `/tesouraria` | Caixa de cada Ordem: saldo anterior, entradas, saídas e saldo no período; lista de lançamentos com filtros por Ordem, período, tipo, categoria e busca |
| `/tesouraria/novo`, `/tesouraria/[id]/editar` | Registrar, corrigir e excluir lançamento (entrada ou saída) |
| `/relatorios` | Atalhos para os documentos: fichas em lote, quadro de irmãos e extrato do caixa |
| `/ajustes` | Categorias do caixa (criar, renomear, excluir) |
| `/imprimir/ficha/[id]` | Ficha de um irmão para impressão: cadastral ou de uma Ordem (`?modelo=`) |
| `/imprimir/fichas`, `/imprimir/quadro` | Fichas de todos os irmãos de uma Ordem e quadro de irmãos (`?ordem=`) |
| `/imprimir/extrato` | Extrato do caixa com saldo acumulado (`?ordem=&de=&ate=`) |
| `/admissoes` | Sem especificação recebida: exibe o estado vazio do design system |

As telas em `/imprimir` são folhas A4 sem o menu lateral. O botão **Imprimir** abre a janela de impressão do navegador; para gerar PDF, escolha a opção de salvar como PDF nessa janela. Na ficha de uma Ordem de que o irmão ainda não participa, os campos da Ordem saem em branco para preenchimento à mão.

## Rodar localmente

Pré-requisitos: Node 20+ e Docker (para o Supabase local).

```bash
npm install
npm run db:start             # sobe Postgres + Auth locais e aplica migrations e seed
cp .env.example .env.local   # use a URL e a chave que o db:start imprime (API URL / anon key)
npm run dev                  # http://localhost:3000
```

`npm run db:start` imprime, entre outros, `API URL` (`http://127.0.0.1:54321`) e `anon key`; coloque-os em `.env.local`. Para criar o primeiro usuário local, abra o Studio em <http://127.0.0.1:54323> (Authentication → Users → Add user) ou use a API de admin com a `service_role key` impressa pelo mesmo comando:

```bash
curl -X POST http://127.0.0.1:54321/auth/v1/admin/users \
  -H "apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"escriba@keystone.local","password":"keystone123","email_confirm":true}'
```

`npm run db:stop` derruba os contêineres; `npm run db:reset` recria o banco do zero (migrations + seed). Sem `.env.local` o app sobe e mostra a tela "Configuração pendente".

Para apontar para um projeto hospedado em vez do local, siga a seção seguinte.

## Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com) e copie, em **Project Settings → API**, a **Project URL** e a chave pública (`anon` ou `publishable`).
2. Aplique as migrations de `supabase/migrations/` na ordem dos nomes. Duas opções:
   - **CLI:** `npx supabase login`, `npx supabase link --project-ref <ref>` e `npm run db:push`.
   - **SQL Editor** do painel: cole e execute cada arquivo, do mais antigo para o mais novo.
3. (Opcional) Dados de exemplo: execute `supabase/seed.sql` no SQL Editor.
4. Crie o primeiro usuário em **Authentication → Users → Add user** (e-mail e senha). Todo usuário autenticado tem acesso total às tabelas de cadastro e do caixa; a chave pública sem sessão não lê nada (RLS).
5. Antes de usar o caixa: revise a lista de categorias em **Ajustes** (a migration traz uma lista inicial provisória) e lance o saldo de abertura de cada Ordem como uma entrada na categoria "Saldo inicial".

## Publicar na Vercel

1. Importe o repositório em [vercel.com/new](https://vercel.com/new). O framework Next.js é detectado automaticamente.
2. Em **Environment Variables**, defina:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy. Depois, em **Supabase → Authentication → URL Configuration**, adicione a URL da Vercel em *Site URL* / *Redirect URLs*.

## Scripts

| Comando | Ação |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build de produção e servidor |
| `npm run lint` | ESLint (regras do Next) |
| `npm run db:start` / `npm run db:stop` | Supabase local via Docker (migrations e seed aplicados ao subir) |
| `npm run db:reset` | Recria o banco local do zero |
| `npm run db:push` | Aplica as migrations no projeto Supabase vinculado (requer `supabase link`) |

## Estrutura

```
src/app/            rotas (App Router); (app)/ é a área autenticada, login/ é pública
src/app/imprimir/   documentos para impressão (fichas, quadro, extrato), autenticados e sem o Shell
src/components/     Shell, Sidebar, Topbar, Emblema, Folha e FichaIrmao (documentos) e peças de layout
src/ds/             design system vendorizado (tokens + componentes React)
src/lib/            cliente Supabase (server), consultas, formatação (datas, dinheiro) e envio de formulários
src/proxy.js        renova a sessão e redireciona quem não está autenticado
supabase/           migrations e seed
.claude/skills/ordens-inglesas-design/   espelho do projeto no Claude Design (fonte do design system)
.claude/specs/      specs (spec-driven development)
```

## Emblema

O emblema da chave de abóbada (`assets/keystone.jpg` no Claude Design) é uma ilustração licenciada pela Getty Images / iStock e por isso **não é versionado**. Coloque o arquivo em `public/keystone.jpg` no seu ambiente e na Vercel (por exemplo, via um bucket público ou commit em repositório privado). Sem ele, o app mostra um glifo SVG no lugar.
