# UI kit — Plataforma das Ordens Inglesas

Recriação clicável do produto interno. Abra `index.html`.

**Telas:** `Login.jsx` (acesso por matrícula, painel cerimonial navy com marca-d'água da chave) → `Painel.jsx` (métricas do exercício, últimos lançamentos, composição por Ordem, agenda) → `Cadastro.jsx` (busca + filtro por Ordem, tabela de irmãos e painel de detalhe de 380px com abas Dados/Graus/Financeiro) → `Admissoes.jsx` (fluxo de 4 etapas, aprovação por Dialog com confirmação e Toast) → `Tesouraria.jsx` (métricas, abas Todos/Em aberto/Quitados, total do recorte, cobrança e inadimplência).

**Estrutura:** `Shell.jsx` (sidebar navy 264px + topbar 60px + placeholder de telas não especificadas), `dados.jsx` (dados fictícios), `App.jsx` (roteamento de estado).

**Fluxo demonstrado:** entrar → navegar pela sidebar → filtrar cadastro e abrir um irmão → aprovar uma admissão (confirmação + aviso) → filtrar lançamentos na tesouraria.

Telas **Capítulos e Arcas**, **Relatórios** e **Ajustes** aparecem propositalmente vazias: nenhuma especificação foi fornecida para elas.

Todos os componentes vêm do bundle do design system (`_ds_bundle.js`); nada de primitiva reimplementada aqui.
