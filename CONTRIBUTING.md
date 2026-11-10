# Fluxo de trabalho no Git

Regras de branches, commits e pull requests do Keystone. Valem para pessoas e para agentes (Claude Code).

## Modelo

Uma única branch permanente, `main`, e branches curtas de trabalho que entram por pull request.

- `main` é o que está em produção: a Vercel publica cada commit que chega nela.
- Não existem branches `develop`, `release` ou de ambiente. Cada PR ganha um deploy de preview na Vercel, que faz o papel de homologação.
- Ninguém faz commit nem push direto na `main`. Toda mudança, inclusive documentação e correção urgente, passa por PR.

O plano atual do GitHub não oferece proteção de branch em repositório privado, então a regra acima não é imposta pela plataforma: é cumprida por convenção.

## Branches

Crie a branch a partir da `main` atualizada:

```bash
git switch main
git pull
git switch -c feat/recibo-numerado
```

Nome: `<tipo>/<descricao-curta>`, em minúsculas, sem acentos, palavras separadas por hífen.

| Tipo | Uso |
| --- | --- |
| `feat/` | funcionalidade nova |
| `fix/` | correção de defeito, inclusive urgente em produção |
| `docs/` | documentação e specs, sem mudança de código |
| `refactor/` | reorganização sem mudança de comportamento |
| `test/` | testes |
| `chore/` | dependências, configuração, limpeza |

Regras:

- Uma branch trata de um assunto. Se o trabalho pertence a uma spec, cite o número no nome ou no PR (`feat/002-extrato-caixa`).
- Branches vivem pouco. Se a `main` avançou, atualize a sua com `git rebase main` (ou `git merge main` se a branch já é compartilhada) antes de pedir revisão.
- Branches geradas com nome automático (por exemplo `claude/...`) são renomeadas para o padrão antes de abrir o PR.
- Depois do merge a branch é apagada, no GitHub e na máquina local.

## Commits

Mensagens seguem [Conventional Commits](https://www.conventionalcommits.org/pt-br/): `<tipo>(<escopo opcional>): <resumo>`.

```
feat(tesouraria): filtro por categoria no extrato
fix(cadastro): CPF com zeros à esquerda
docs(specs): spec 003 de anuidades
```

- Tipos aceitos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
- Resumo no imperativo, em minúsculas, sem ponto final, até cerca de 72 caracteres.
- Cada commit deixa o projeto em estado que compila. Separe mudanças independentes (migration, tela, documentação) em commits próprios.
- Nunca entram no repositório: `.env*` com valores reais, chaves do Supabase, `public/keystone.jpg` (imagem licenciada) e dados pessoais reais de irmãos.

## Pull requests

1. Antes de abrir, rode `npm run lint` e `npm run build`. Se o PR tem migration, rode também `npm run db:reset` para confirmar que o banco sobe do zero.
2. O título segue o mesmo formato dos commits, porque vira a referência do histórico.
3. Preencha o modelo do PR: o que muda, como foi validado e o que ficou de fora.
4. PRs pequenos. Mudança de banco e a tela que depende dela podem ir juntas; assuntos sem relação vão em PRs separados.
5. Quem abre não aprova o próprio PR quando há outra pessoa disponível para revisar. Trabalho feito por agente é sempre revisado por uma pessoa antes do merge.
6. O merge é feito com **merge commit** (opção "Create a merge commit"), que preserva os commits da branch. Não use squash nem rebase pelo GitHub.
7. Não reescreva o histórico da `main` (`push --force`, `reset`). Em branch de trabalho, `--force-with-lease` é aceito enquanto só você a usa.

## Banco de dados

- Uma migration aplicada nunca é editada. Toda mudança de schema é um arquivo novo em `supabase/migrations/`, com o prefixo de data e hora da criação.
- A migration entra no mesmo PR do código que depende dela.
- Aplique no projeto Supabase de produção (`npm run db:push`) logo depois do merge, antes de considerar a entrega concluída. Escreva migrations que não quebrem a versão anterior do app enquanto o deploy acontece.

## Correção urgente

Mesmo fluxo, sem atalho: branch `fix/...` a partir da `main`, PR, validação no preview da Vercel e merge. Para desfazer uma entrega com problema, use `git revert` em um PR; não reescreva a `main`.
