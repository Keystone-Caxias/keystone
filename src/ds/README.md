# src/ds — design system vendorizado

Cópia de `.claude/skills/ordens-inglesas-design/{tokens,components}` feita em 2026-09-18 para consumo pelo app Next.js.

Diferenças em relação à fonte (necessárias para rodar no App Router):

1. `'use client';` na primeira linha de todo componente (todos usam hooks).
2. `React.useId()` chamado incondicionalmente (`const autoId = React.useId(); const x = id || autoId;`) em Checkbox, Input, Radio, Select e Switch — a forma original `id || React.useId()` viola as regras de hooks.

Ao atualizar o design system, copie `tokens/` e `components/` de novo e reaplique os dois ajustes acima. Importe sempre de `@/ds` (barrel `index.js`), nunca dos arquivos internos (regra em `_adherence.oxlintrc.json`).
