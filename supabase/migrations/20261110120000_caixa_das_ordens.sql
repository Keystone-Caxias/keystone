-- 003 · Caixa das Ordens (spec 002-mvp-fichas-e-caixa)
-- 1) tipos e tabelas: categoria_caixa e lancamento_caixa
-- 2) gatilhos: updated_at e autoria do lançamento
-- 3) função caixa_resumo: totais exatos por Ordem em um período
-- 4) RLS e privilégios
-- 5) categorias iniciais (provisórias; os oficiais editam na tela Ajustes)

-- ---------- 1) tipos e tabelas ----------
-- Mesmos nomes das tabelas de registro (arco_real, marca, nauta).
CREATE TYPE ordem_inglesa AS ENUM ('arco_real', 'marca', 'nauta');
CREATE TYPE tipo_lancamento AS ENUM ('entrada', 'saida');

CREATE TABLE categoria_caixa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL CHECK (btrim(nome) <> ''),
    tipo tipo_lancamento NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- alvo da FK composta de lancamento_caixa: garante categoria do mesmo tipo do lançamento
    CONSTRAINT categoria_caixa_id_tipo_key UNIQUE (id, tipo)
);
CREATE UNIQUE INDEX categoria_caixa_nome_tipo_key ON categoria_caixa (lower(nome), tipo);

CREATE TABLE lancamento_caixa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordem ordem_inglesa NOT NULL,
    tipo tipo_lancamento NOT NULL,
    data DATE NOT NULL,
    valor NUMERIC(12,2) NOT NULL CHECK (valor > 0),
    categoria_id UUID NOT NULL,
    descricao TEXT,
    -- RESTRICT: um irmão com lançamentos não pode ser excluído (o dinheiro não perde a origem).
    macom_id UUID REFERENCES macom(id) ON DELETE RESTRICT,
    criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    criado_por_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT lancamento_caixa_categoria_fkey
        FOREIGN KEY (categoria_id, tipo) REFERENCES categoria_caixa (id, tipo)
);
CREATE INDEX idx_lancamento_caixa_ordem_data ON lancamento_caixa (ordem, data DESC);
CREATE INDEX idx_lancamento_caixa_macom_id ON lancamento_caixa (macom_id);
CREATE INDEX idx_lancamento_caixa_categoria_id ON lancamento_caixa (categoria_id);

-- ---------- 2) gatilhos ----------
CREATE TRIGGER trg_categoria_caixa_updated_at BEFORE UPDATE ON categoria_caixa
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_lancamento_caixa_updated_at BEFORE UPDATE ON lancamento_caixa
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Quem lançou: vem da sessão do oficial, nunca do que o cliente enviar, e não muda em edições.
-- Sem sessão (seed, SQL Editor, service_role) os valores informados são mantidos.
CREATE OR REPLACE FUNCTION carimbar_autor_lancamento()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN NEW;
    END IF;
    IF TG_OP = 'INSERT' THEN
        NEW.criado_por := auth.uid();
        NEW.criado_por_email := auth.jwt() ->> 'email';
    ELSE
        NEW.criado_por := OLD.criado_por;
        NEW.criado_por_email := OLD.criado_por_email;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_lancamento_caixa_autor BEFORE INSERT OR UPDATE ON lancamento_caixa
    FOR EACH ROW EXECUTE FUNCTION carimbar_autor_lancamento();

-- ---------- 3) resumo do caixa ----------
-- Uma linha por Ordem com saldo anterior a p_inicio, entradas e saídas entre p_inicio e p_fim
-- e saldo ao fim de p_fim. Existe porque a API devolve no máximo 1000 linhas por consulta:
-- somar no cliente erraria em silêncio. SECURITY INVOKER: vale o RLS de quem chama.
CREATE OR REPLACE FUNCTION caixa_resumo(p_inicio DATE, p_fim DATE, p_ordem ordem_inglesa DEFAULT NULL)
RETURNS TABLE (
    ordem ordem_inglesa,
    saldo_anterior NUMERIC,
    entradas NUMERIC,
    saidas NUMERIC,
    saldo_final NUMERIC,
    lancamentos BIGINT
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
    SELECT o.ordem,
           COALESCE(SUM(CASE WHEN l.tipo = 'entrada' THEN l.valor ELSE -l.valor END) FILTER (WHERE l.data < p_inicio), 0),
           COALESCE(SUM(l.valor) FILTER (WHERE l.tipo = 'entrada' AND l.data >= p_inicio), 0),
           COALESCE(SUM(l.valor) FILTER (WHERE l.tipo = 'saida' AND l.data >= p_inicio), 0),
           COALESCE(SUM(CASE WHEN l.tipo = 'entrada' THEN l.valor ELSE -l.valor END), 0),
           COUNT(l.id) FILTER (WHERE l.data >= p_inicio)
    FROM unnest(enum_range(NULL::public.ordem_inglesa)) AS o(ordem)
    LEFT JOIN public.lancamento_caixa AS l ON l.ordem = o.ordem AND l.data <= p_fim
    WHERE p_ordem IS NULL OR o.ordem = p_ordem
    GROUP BY o.ordem
    ORDER BY o.ordem;
$$;

-- ---------- 4) RLS e privilégios ----------
ALTER TABLE categoria_caixa  ENABLE ROW LEVEL SECURITY;
ALTER TABLE lancamento_caixa ENABLE ROW LEVEL SECURITY;

-- Mesma regra das cinco tabelas de cadastro: qualquer oficial autenticado lê e escreve tudo.
CREATE POLICY autenticados_tudo_categoria_caixa ON categoria_caixa
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY autenticados_tudo_lancamento_caixa ON lancamento_caixa
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Privilégios explícitos: não dependem da exposição automática de tabelas novas à API.
REVOKE ALL ON categoria_caixa, lancamento_caixa FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON categoria_caixa, lancamento_caixa TO authenticated;
GRANT ALL ON categoria_caixa, lancamento_caixa TO service_role;

REVOKE EXECUTE ON FUNCTION caixa_resumo(DATE, DATE, ordem_inglesa) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION caixa_resumo(DATE, DATE, ordem_inglesa) TO authenticated, service_role;

-- ---------- 5) categorias iniciais ----------
-- Lista provisória (spec 002, pergunta "CAIXA, categorias"). Editável na tela Ajustes.
INSERT INTO categoria_caixa (nome, tipo) VALUES
    ('Saldo inicial', 'entrada'),
    ('Anuidade', 'entrada'),
    ('Joia', 'entrada'),
    ('Taxa de admissão', 'entrada'),
    ('Doação', 'entrada'),
    ('Outras entradas', 'entrada'),
    ('Taxas e repasses', 'saida'),
    ('Paramentos e materiais', 'saida'),
    ('Aluguel e manutenção', 'saida'),
    ('Ágape', 'saida'),
    ('Beneficência', 'saida'),
    ('Outras saídas', 'saida');
