# Tasks — <NNN-slug>

> Cada WP cabe em 30–90 min. Se estourar, divida.
> Lanes válidas: `planejado` → `fazendo` → `revisão` → `pronto`.
> Movimentos: `planejado→fazendo` e `fazendo→revisão` são do Software Engineer. `revisão→pronto` e `revisão→fazendo` são do Review Agent.

---

## WP01 — <título curto e acionável>

```yaml
lane: planejado
estimativa: 60min
files:
  - src/caminho/arquivo1.ext
  - src/caminho/arquivo2.ext
depende_de: []
```

### Objetivo
<1–2 linhas: o que essa WP entrega.>

### Passos
1. <passo concreto>
2. <passo concreto>
3. <passo concreto>

### Definição de Pronto
- [ ] <critério 1, verificável>
- [ ] <critério 2>
- [ ] <critério 3>
- [ ] Código compila / lint passa
- [ ] Caso de uso principal testado manualmente
- [ ] `README.md` atualizado se aplicável

### Log
<!-- Software Engineer e Review Agent adicionam linhas aqui. Não apague o que já está. -->
- AAAA-MM-DD: <evento, ex: "iniciada", "concluída, movida para revisão", "feedback do review">

---

## WP02 — <título>

```yaml
lane: planejado
estimativa: 45min
files:
  - src/caminho/outro.ext
depende_de: [WP01]
```

### Objetivo
<...>

### Passos
1. <...>

### Definição de Pronto
- [ ] <...>

### Log

---

<!-- Adicione mais WPs seguindo o mesmo formato. Numere em sequência: WP03, WP04, ... -->
