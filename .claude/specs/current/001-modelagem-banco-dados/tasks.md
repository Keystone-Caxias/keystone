# Tasks — 001-modelagem-banco-dados

> Cada WP cabe em 30–90 min. Se estourar, divida.
> Lanes válidas: `planejado` → `fazendo` → `revisão` → `pronto`.
> Movimentos: `planejado→fazendo` e `fazendo→revisão` são do Software Engineer. `revisão→pronto` e `revisão→fazendo` são do Review Agent.

---

## WP01 — Criar migration do schema (enum + 5 tabelas)

```yaml
lane: revisão
estimativa: 60min
files:
  - supabase/migrations/20260812120000_criar_schema_macons.sql
depende_de: []
```

### Objetivo
Criar o arquivo de migration SQL com o tipo enum `potencia_simbolica` e as tabelas `loja`, `macom`, `arco_real`, `marca` e `nauta`, seguindo exatamente o DDL definido em `plan.json` → `estrutura_dados`.

### Passos
1. Criar a pasta `supabase/migrations/` se não existir.
2. Criar `20260812120000_criar_schema_macons.sql` com o DDL de `plan.json` (enum, 5 `CREATE TABLE`, índice em `macom.loja_id`).
3. Conferir que todos os campos do `rascunho_DB.md` estão presentes nas colunas correspondentes.
4. Conferir que PKs usam `gen_random_uuid()`, FKs apontam certo (`macom.loja_id → loja.id`, `arco_real/marca/nauta.macom_id → macom.id`) e que `macom_id` nas três tabelas de ordens tem `UNIQUE`.

### Definição de Pronto
- [ ] Arquivo `supabase/migrations/20260812120000_criar_schema_macons.sql` existe e contém o DDL completo das 5 tabelas + enum
- [ ] Todo campo listado em `rascunho_DB.md` está mapeado para uma coluna
- [ ] FKs e UNIQUEs conferem com `plan.json` (`arco_real`, `marca`, `nauta` com `macom_id UNIQUE`)
- [ ] SQL não tem erro de sintaxe (validar rodando no WP02)
- [ ] Nenhum arquivo fora de `files:` foi tocado

### Log
<!-- Software Engineer e Review Agent adicionam linhas aqui. Não apague o que já está. -->
- 2026-08-12: WP criada
- 2026-08-12: iniciada
- 2026-08-12: concluída, movida para revisão. Migration criada com os 5 CREATE TABLE + enum, validada em WP02.

---

## WP02 — Aplicar migration no Postgres local e validar estrutura

```yaml
lane: revisão
estimativa: 30min
files: []
depende_de: [WP01]
```

### Objetivo
Rodar a migration da WP01 no Postgres 18 local e confirmar, via `psql`, que a estrutura criada (tabelas, colunas, PKs, FKs, UNIQUEs, enum) corresponde ao que foi planejado — sem alterar nenhum arquivo do repositório, só validar o SQL já escrito.

### Passos
1. Criar o banco de desenvolvimento se ainda não existir: `createdb keystone_dev` (usando os binários em `/Library/PostgreSQL/18/bin`).
2. Aplicar a migration: `psql -d keystone_dev -f supabase/migrations/20260812120000_criar_schema_macons.sql`.
3. Rodar `\d loja`, `\d macom`, `\d arco_real`, `\d marca`, `\d nauta` no psql e conferir colunas, tipos, PK/FK/UNIQUE contra `plan.json`.
4. Rodar `\dT potencia_simbolica` (ou `\dT+`) e confirmar os 3 valores do enum (GOB, CMSB, COMAB).
5. Se algo no SQL estiver errado, corrigir o arquivo da WP01 (não criar arquivo novo) e reaplicar.

### Definição de Pronto
- [ ] Banco `keystone_dev` criado localmente
- [ ] Migration aplicada sem erros
- [ ] `\d` de cada uma das 5 tabelas confere com o DDL planejado (colunas, PK, FK, UNIQUE, NOT NULL)
- [ ] Enum `potencia_simbolica` tem exatamente os valores GOB, CMSB, COMAB
- [ ] Nenhum arquivo fora de `files:` foi tocado (WP é só validação, sem `files:`)

### Log
- 2026-08-12: WP criada
- 2026-08-12: iniciada
- 2026-08-12: concluída, movida para revisão. Banco `keystone_dev` criado, migration aplicada sem erros. `\d` das 5 tabelas e `\dT+ potencia_simbolica` conferem exatamente com `plan.json` (PKs em UUID/gen_random_uuid, FKs corretas, UNIQUE em cpf e nos macom_id das 3 ordens, enum com GOB/CMSB/COMAB).

---

## WP03 — Seed de dados de exemplo e validação de constraints

```yaml
lane: revisão
estimativa: 45min
files:
  - supabase/seed.sql
depende_de: [WP02]
```

### Objetivo
Criar `supabase/seed.sql` com dados de exemplo (lojas, maçons e registros de Arco Real/Marca/Nauta) e usar esses dados para provar que as constraints do schema (CPF único, enum fechado, um registro por ordem por maçom) realmente barram dados inválidos.

### Passos
1. Escrever `supabase/seed.sql` com: 1–2 lojas, 2–3 maçons vinculados a essas lojas, e ao menos um registro de cada ordem (`arco_real`, `marca`, `nauta`) para algum dos maçons.
2. Rodar o seed no `keystone_dev`: `psql -d keystone_dev -f supabase/seed.sql`.
3. Validar as constraints tentando (manualmente, via psql, sem gravar essas tentativas no seed):
   - Inserir um maçom com CPF já existente → deve falhar (violação de UNIQUE).
   - Inserir uma loja com `potencia_simbolica` fora de GOB/CMSB/COMAB → deve falhar (violação de enum).
   - Inserir um segundo registro de `arco_real` para um maçom que já tem um → deve falhar (violação de UNIQUE em `macom_id`).
4. Registrar no Log desta WP que as 3 tentativas de violação foram testadas e rejeitadas como esperado.

### Definição de Pronto
- [ ] `supabase/seed.sql` existe e popula as 5 tabelas com dados coerentes entre si (FKs válidas)
- [ ] Seed roda sem erros no `keystone_dev`
- [ ] Tentativa de CPF duplicado foi testada e rejeitada pelo banco
- [ ] Tentativa de potência simbólica inválida foi testada e rejeitada pelo banco
- [ ] Tentativa de segundo registro de mesma ordem para o mesmo maçom foi testada e rejeitada pelo banco
- [ ] Nenhum arquivo fora de `files:` foi tocado

### Log
- 2026-08-12: WP criada
- 2026-08-12: iniciada
- 2026-08-12: concluída, movida para revisão. `supabase/seed.sql` populado (2 lojas, 3 maçons, 1 registro de cada ordem). Seed rodou sem erros. As 3 violações testadas manualmente (CPF duplicado, enum inválido, segundo Arco Real para o mesmo maçom) foram todas rejeitadas pelo Postgres com o erro esperado.

---

<!-- Adicione mais WPs seguindo o mesmo formato. Numere em sequência: WP04, ... -->
