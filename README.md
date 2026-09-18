# Keystone · Plataforma das Ordens Inglesas

Plataforma interna de **cadastro de irmãos, lojas simbólicas e registros de Arco Real, Mestre Maçom da Marca e Nautas da Arca Real**. Usada por oficiais (Escriba, Tesoureiro, Secretário).

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
| `/admissoes`, `/tesouraria`, `/relatorios`, `/ajustes` | Sem especificação recebida: exibem o estado vazio do design system |

## Rodar localmente

Pré-requisitos: Node 20+ e um projeto no Supabase.

```bash
npm install
cp .env.example .env.local   # preencha com a URL e a chave pública do projeto
npm run dev                  # http://localhost:3000
```

Sem `.env.local` o app sobe e mostra a tela "Configuração pendente".

## Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com) e copie, em **Project Settings → API**, a **Project URL** e a chave pública (`anon` ou `publishable`).
2. Aplique as migrations de `supabase/migrations/` na ordem dos nomes. Duas opções:
   - **CLI:** `npx supabase login`, `npx supabase link --project-ref <ref>` e `npm run db:push`.
   - **SQL Editor** do painel: cole e execute cada arquivo, do mais antigo para o mais novo.
3. (Opcional) Dados de exemplo: execute `supabase/seed.sql` no SQL Editor.
4. Crie o primeiro usuário em **Authentication → Users → Add user** (e-mail e senha). Todo usuário autenticado tem acesso total às cinco tabelas; a chave pública sem sessão não lê nada (RLS).

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
| `npm run db:push` | Aplica as migrations no projeto Supabase vinculado (requer `supabase link`) |

## Estrutura

```
src/app/            rotas (App Router); (app)/ é a área autenticada, login/ é pública
src/components/     Shell, Sidebar, Topbar, Emblema e peças de layout
src/ds/             design system vendorizado (tokens + componentes React)
src/lib/            cliente Supabase (server), consultas e formatação
src/proxy.js        renova a sessão e redireciona quem não está autenticado
supabase/           migrations e seed
.claude/skills/ordens-inglesas-design/   espelho do projeto no Claude Design (fonte do design system)
.claude/specs/      specs (spec-driven development)
```

## Emblema

O emblema da chave de abóbada (`assets/keystone.jpg` no Claude Design) é uma ilustração licenciada pela Getty Images / iStock e por isso **não é versionado**. Coloque o arquivo em `public/keystone.jpg` no seu ambiente e na Vercel (por exemplo, via um bucket público ou commit em repositório privado). Sem ele, o app mostra um glifo SVG no lugar.
