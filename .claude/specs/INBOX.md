# INBOX

> Ideias soltas, bugs e dívidas técnicas. **Uma linha por item.** Não vire wiki — itens promovidos viram spec própria.
>
> Formato: `- AAAA-MM-DD <tipo>: <descrição curta>` onde `<tipo>` é `ideia`, `bug`, `dívida` ou `pergunta`.
>
> Quando um item virar feature, mova para `ROADMAP.md` e remova daqui (com o commit que faz isso, dá pra rastrear o histórico via git log).

## Itens abertos

- 2026-11-10 pergunta: regras de negócio do MVP: 7 decididas no refino e 7 ainda em aberto estão em `current/002-mvp-fichas-e-caixa/spec.html`, seção "Precisa esclarecer"; responder lá depois do debate
- 2026-11-10 dívida: o app Next.js (login, cadastro, lojas) entrou sem spec própria; a referência do que existe é o README
- 2026-11-10 dívida: as três WPs da spec 001 estão em `revisão` desde 2026-08-12, sem passar pelo Review Agent
- 2026-11-10 dívida: listas de irmãos leem no máximo 1000 linhas por consulta (limite da API do Supabase); paginar quando o cadastro crescer
- 2026-11-10 dívida: CPF e demais dados pessoais ficam em texto puro; avaliar junto com a pergunta de LGPD
- 2026-11-10 dívida: sem testes automatizados; a validação é manual contra o Supabase local
- 2026-11-10 dívida: salvar irmão grava o cadastro e depois cada Ordem em chamadas separadas; se uma falhar, o cadastro fica gravado pela metade (levar para uma função SQL única)
- 2026-11-10 dívida: o perfil somente leitura ainda vê os botões de criar e editar; a gravação é recusada com mensagem, mas os botões poderiam sumir
- 2026-11-10 dívida: não há "esqueci minha senha"; a senha é redefinida pelo administrador no painel do Supabase

## Promovidos para Roadmap

<!-- Linhas movidas daqui para ROADMAP. Manter só os 10 mais recentes; o resto sai. -->
