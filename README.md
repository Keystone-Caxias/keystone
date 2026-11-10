# Keystone · Plataforma das Ordens Inglesas

Plataforma interna de **cadastro de irmãos, lojas simbólicas e registros de Arco Real, Mestre Maçom da Marca e Nautas da Arca Real**, com **emissão de fichas preenchidas** e **caixa de cada Ordem**. Usada por oficiais (Escriba, Tesoureiro, Secretário).

> **MVP em avaliação.** As regras em vigor estão na seção [Regras de negócio em vigor](#regras-de-negócio-em-vigor). As que ainda dependem de decisão dos responsáveis, com o comportamento provisório de cada uma, estão em [`.claude/specs/current/002-mvp-fichas-e-caixa/spec.html`](.claude/specs/current/002-mvp-fichas-e-caixa/spec.html), seção "Precisa esclarecer" (abra o arquivo no navegador).

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
| `/tesouraria/novo`, `/tesouraria/[id]/editar` | Registrar, corrigir e excluir lançamento (entrada ou saída); a edição mostra o histórico do lançamento |
| `/tesouraria/historico` | Histórico do caixa: quem criou, alterou ou excluiu cada lançamento |
| `/relatorios` | Atalhos para os documentos: fichas em lote, quadro de irmãos e extrato do caixa |
| `/ajustes` | Oficiais e papéis, fechamento do caixa por Ordem, categorias do caixa e troca da própria senha |
| `/imprimir/ficha/[id]` | Ficha de um irmão para impressão: cadastral ou de uma Ordem (`?modelo=`) |
| `/imprimir/fichas`, `/imprimir/quadro` | Fichas de todos os irmãos de uma Ordem e quadro de irmãos (`?ordem=`) |
| `/imprimir/extrato` | Extrato do caixa com saldo acumulado (`?ordem=&de=&ate=`) |
| `/imprimir/recibo/[id]` | Recibo de uma entrada, com número e valor por extenso |
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

`npm run db:start` imprime, entre outros, `API URL` (`http://127.0.0.1:54321`) e `anon key`; coloque-os em `.env.local`. Para criar o primeiro usuário local, abra o Studio em <http://127.0.0.1:54323> (Authentication → Users → Add user) ou use a API de admin com a `service_role key` impressa pelo mesmo comando, e em seguida autorize a conta como administrador:

```bash
curl -X POST http://127.0.0.1:54321/auth/v1/admin/users \
  -H "apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"escriba@keystone.local","password":"keystone123","email_confirm":true}'

docker exec supabase_db_keystone psql -U postgres \
  -c "select public.oficial_definir('escriba@keystone.local', 'administrador');"
```

O `db:reset` apaga também as contas locais: repita os dois comandos depois dele.

`npm run db:stop` derruba os contêineres; `npm run db:reset` recria o banco do zero (migrations + seed). Sem `.env.local` o app sobe e mostra a tela "Configuração pendente".

Para publicar em um projeto hospedado, siga a seção seguinte.

## Publicar em produção (Supabase + Vercel)

Siga na ordem. Cada passo termina com o que conferir.

### 1. Projeto no Supabase

1. Crie o projeto em [supabase.com](https://supabase.com) na região **South America (São Paulo)**, a mesma em que a Vercel executa o app (`vercel.json` fixa `gru1`).
2. Aplique as migrations de `supabase/migrations/`, na ordem dos nomes:
   - **CLI (recomendado):** `npx supabase login`, `npx supabase link --project-ref <ref>` e `npm run db:push`.
   - **SQL Editor:** cole e execute cada arquivo, do mais antigo para o mais novo.
3. **Não** execute `supabase/seed.sql` em produção: são irmãos e lançamentos fictícios.
4. Em **Authentication → Sign In / Providers**, desligue **Allow new users to sign up** e mantenha o provedor **Email** ligado. (O `supabase/config.toml` vale só para o ambiente local.)
5. Em **Authentication → URL Configuration**, coloque a URL de produção da Vercel em **Site URL**.
6. Copie, em **Project Settings → API**, a **Project URL** e a chave pública (`anon` ou `publishable`). Nunca use a `service_role` no app.

Confira: em **Database → Tables**, as tabelas `oficial`, `caixa_fechamento` e `lancamento_caixa_historico` existem e todas mostram RLS ligado.

### 2. Contas e primeiro administrador

Ter uma conta não basta: só quem consta na tabela `oficial` lê ou grava dados. Assim, mesmo que o cadastro público de contas fique ligado por engano, uma conta nova não vê nada.

1. Crie a conta de cada oficial em **Authentication → Users → Add user** (e-mail e senha provisória, com *Auto Confirm User*).
2. Defina o primeiro administrador no **SQL Editor**:

   ```sql
   select public.oficial_definir('email-do-administrador@exemplo.com', 'administrador');
   ```

3. Os demais são autorizados pelo próprio administrador, em **Ajustes → Oficiais e acesso** (e-mail da conta + papel). Cada oficial troca a senha provisória em **Ajustes → Alterar senha**.

| Papel | O que faz |
| --- | --- |
| Administrador | Tudo o que o oficial faz, mais autorizar oficiais e fechar ou reabrir o caixa |
| Oficial | Cadastra e altera irmãos, lojas, lançamentos e categorias |
| Somente leitura | Consulta as telas e emite documentos, sem gravar |

Quem entra com uma conta não autorizada vê a tela "Acesso pendente" (com o comando acima, se ainda não houver nenhum oficial). Contas que já existiam quando a migration 004 foi aplicada viram administradores, porque antes dela toda conta tinha acesso total: revise a lista em Ajustes.

### 3. Projeto na Vercel

1. Importe o repositório em [vercel.com/new](https://vercel.com/new). O framework Next.js é detectado automaticamente; não há configuração de build.
2. Em **Settings → Environment Variables**, defina para **Production** (e para **Preview**, veja o aviso abaixo):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Faça o deploy. As duas variáveis entram no build: ao trocá-las, refaça o deploy.

> **Previews usam o banco que você apontar.** Cada PR ganha um deploy de preview. Se as variáveis de *Preview* forem as de produção, testar um PR altera dados reais. Para um ambiente de homologação de verdade, crie um segundo projeto Supabase (com as mesmas migrations e, aí sim, o `seed.sql`) e use as chaves dele em *Preview*.

Confira: sem as variáveis o app mostra "Configuração pendente"; com elas, `/login`.

### 4. Antes de liberar o uso

- [ ] Entrar com o administrador e autorizar os demais oficiais.
- [ ] Revisar as categorias do caixa em **Ajustes** (a migration traz uma lista inicial provisória).
- [ ] Lançar o saldo de abertura de cada Ordem como entrada na categoria "Saldo inicial", com a data de corte, e fechar o caixa até essa data em **Ajustes → Fechamento do caixa**.
- [ ] Cadastrar as lojas simbólicas e os irmãos.
- [ ] Definir a rotina de backup: confira em **Database → Backups** o que o plano do projeto oferece e, se preciso, exporte o banco periodicamente com `supabase db dump`.
- [ ] Projetos do plano gratuito do Supabase podem ser pausados por inatividade; nesse caso, reative no painel.

### Atualizações

Toda mudança entra por PR (ver `CONTRIBUTING.md`); o merge na `main` publica na Vercel. O CI (`.github/workflows/ci.yml`) roda `lint` e `build` em cada PR. Se o PR tem migration, aplique-a no Supabase (`npm run db:push`) **antes** do merge: as migrations só acrescentam, então o app antigo continua funcionando com o banco novo.

## Regras de negócio em vigor

| Assunto | Regra |
| --- | --- |
| Acesso | Só contas autorizadas (tabela `oficial`), com três papéis. Acesso separado por Ordem ou por cargo não existe. |
| Lançamentos | Cada lançamento tem número sequencial único, nunca reaproveitado. Data futura é recusada. Forma de pagamento é opcional e informativa; o saldo é único por Ordem. |
| Correção | Lançamento em período aberto pode ser alterado e excluído; toda criação, alteração e exclusão fica no **Histórico do caixa** (autor, hora, antes e depois), que ninguém edita. |
| Fechamento | O administrador fecha o caixa de uma Ordem até uma data; lançamentos até essa data não podem ser criados, alterados nem excluídos (o banco recusa). Reabrir também é do administrador. |
| Recibo | Entradas emitem recibo imprimível com o número do lançamento e o valor por extenso. |
| Irmão que sai | Em cada Ordem o irmão está ativo, licenciado ou desligado; desligados e falecidos saem do quadro, das fichas em lote e das contagens, e o registro é mantido. Irmão com lançamentos no caixa não pode ser excluído. |
| Cadastro | CPF com dígitos verificadores válidos e único; datas não podem ser futuras nem fora de ordem (iniciação, passagem, elevação, instalação). |

O que continua em aberto (um corpo por Ordem, cobrança de anuidades, modelos oficiais de ficha, admissões, LGPD) está na spec 002, seção "Precisa esclarecer".

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

## Contribuir

Branches, commits e pull requests seguem as regras de [`CONTRIBUTING.md`](CONTRIBUTING.md): a `main` é a produção, todo trabalho entra por PR a partir de uma branch `<tipo>/<descricao>`.

## Emblema

O emblema da chave de abóbada (`assets/keystone.jpg` no Claude Design) é uma ilustração licenciada pela Getty Images / iStock e por isso **não é versionado**. Coloque o arquivo em `public/keystone.jpg` no seu ambiente e na Vercel (por exemplo, via um bucket público ou commit em repositório privado). Sem ele, o app mostra um glifo SVG no lugar.
