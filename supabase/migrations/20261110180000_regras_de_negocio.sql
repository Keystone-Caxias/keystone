-- 004 · Regras de negócio do MVP e preparação para produção (spec 002, refino)
-- 1) oficiais autorizados e papéis: só quem está na tabela `oficial` acessa os dados
-- 2) RLS de todas as tabelas passa a depender do papel (leitura x gravação)
-- 3) situação do irmão em cada Ordem e data de falecimento
-- 4) lançamentos: número sequencial e forma de pagamento
-- 5) fechamento do caixa por Ordem
-- 6) histórico de alterações dos lançamentos

-- ---------- 1) oficiais e papéis ----------
-- Ter uma conta no Supabase Auth não basta: a conta precisa constar em `oficial`.
-- Assim, mesmo que o cadastro público de contas (sign up) fique ligado por engano,
-- uma conta nova não lê nem grava nada.
CREATE TYPE papel_oficial AS ENUM ('administrador', 'oficial', 'leitura');

CREATE TABLE oficial (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    papel papel_oficial NOT NULL DEFAULT 'oficial',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_oficial_updated_at BEFORE UPDATE ON oficial
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Quem já tinha conta antes desta migration tinha acesso total: continua, como administrador.
INSERT INTO oficial (user_id, email, papel)
SELECT id, email, 'administrador' FROM auth.users WHERE email IS NOT NULL;

-- Papel de quem chama (NULL para quem não é oficial). SECURITY DEFINER: lê `oficial`
-- sem depender das políticas da própria tabela.
CREATE FUNCTION papel_atual()
RETURNS papel_oficial
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT o.papel FROM public.oficial AS o WHERE o.user_id = auth.uid();
$$;

CREATE FUNCTION pode_gravar()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT COALESCE(public.papel_atual() IN ('administrador', 'oficial'), false);
$$;

CREATE FUNCTION e_administrador()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT COALESCE(public.papel_atual() = 'administrador', false);
$$;

-- Há algum oficial cadastrado? Usada pela tela "Acesso pendente" para orientar a implantação.
CREATE FUNCTION existe_oficial()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (SELECT 1 FROM public.oficial);
$$;

-- Autoriza uma conta existente (pelo e-mail) ou troca o papel dela.
-- Quem pode chamar: um administrador, ou uma sessão sem usuário (SQL Editor, service_role),
-- que é como se define o primeiro administrador:
--   select public.oficial_definir('fulano@exemplo.com', 'administrador');
CREATE FUNCTION oficial_definir(p_email TEXT, p_papel papel_oficial DEFAULT 'oficial')
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_id UUID;
    v_email TEXT;
BEGIN
    IF auth.uid() IS NOT NULL AND NOT public.e_administrador() THEN
        RAISE EXCEPTION 'Apenas administradores definem oficiais' USING ERRCODE = '42501';
    END IF;
    SELECT u.id, u.email INTO v_id, v_email
    FROM auth.users AS u WHERE lower(u.email) = lower(btrim(p_email)) LIMIT 1;
    IF v_id IS NULL THEN
        RAISE EXCEPTION 'Conta não encontrada para %', p_email USING ERRCODE = 'KS002';
    END IF;
    IF p_papel <> 'administrador'
       AND EXISTS (SELECT 1 FROM public.oficial WHERE user_id = v_id AND papel = 'administrador')
       AND (SELECT count(*) FROM public.oficial WHERE papel = 'administrador') = 1 THEN
        RAISE EXCEPTION 'É preciso manter ao menos um administrador' USING ERRCODE = 'KS003';
    END IF;
    INSERT INTO public.oficial (user_id, email, papel) VALUES (v_id, v_email, p_papel)
    ON CONFLICT (user_id) DO UPDATE SET papel = EXCLUDED.papel, email = EXCLUDED.email;
END;
$$;

-- Retira o acesso de uma conta (a conta em si continua no Supabase Auth).
CREATE FUNCTION oficial_remover(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF auth.uid() IS NOT NULL AND NOT public.e_administrador() THEN
        RAISE EXCEPTION 'Apenas administradores removem oficiais' USING ERRCODE = '42501';
    END IF;
    IF EXISTS (SELECT 1 FROM public.oficial WHERE user_id = p_user_id AND papel = 'administrador')
       AND (SELECT count(*) FROM public.oficial WHERE papel = 'administrador') = 1 THEN
        RAISE EXCEPTION 'É preciso manter ao menos um administrador' USING ERRCODE = 'KS003';
    END IF;
    DELETE FROM public.oficial WHERE user_id = p_user_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION papel_atual(), pode_gravar(), e_administrador(), existe_oficial(),
    oficial_definir(TEXT, papel_oficial), oficial_remover(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION papel_atual(), pode_gravar(), e_administrador(), existe_oficial(),
    oficial_definir(TEXT, papel_oficial), oficial_remover(UUID) TO authenticated, service_role;

ALTER TABLE oficial ENABLE ROW LEVEL SECURITY;
-- Só leitura pela API; inclusão, troca de papel e remoção passam pelas funções acima.
CREATE POLICY oficiais_leem_oficial ON oficial
    FOR SELECT TO authenticated USING ((SELECT public.papel_atual()) IS NOT NULL);
REVOKE ALL ON oficial FROM anon, authenticated;
GRANT SELECT ON oficial TO authenticated;
GRANT ALL ON oficial TO service_role;

-- ---------- 2) RLS por papel nas tabelas existentes ----------
-- Antes: qualquer conta autenticada lia e gravava tudo. Agora: oficiais leem;
-- administrador e oficial gravam; o papel "leitura" só consulta e imprime.
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['loja', 'macom', 'arco_real', 'marca', 'nauta', 'categoria_caixa', 'lancamento_caixa'] LOOP
        EXECUTE format('DROP POLICY IF EXISTS autenticados_tudo_%1$s ON public.%1$I', t);
        EXECUTE format('CREATE POLICY oficiais_leem_%1$s ON public.%1$I FOR SELECT TO authenticated USING ((SELECT public.papel_atual()) IS NOT NULL)', t);
        EXECUTE format('CREATE POLICY oficiais_gravam_%1$s ON public.%1$I FOR ALL TO authenticated USING ((SELECT public.pode_gravar())) WITH CHECK ((SELECT public.pode_gravar()))', t);
    END LOOP;
END;
$$;

-- ---------- 3) situação do irmão ----------
-- Em vez de apagar o registro de quem sai de uma Ordem, marca-se a situação.
CREATE TYPE situacao_ordem AS ENUM ('ativo', 'licenciado', 'desligado');

ALTER TABLE arco_real
    ADD COLUMN situacao situacao_ordem NOT NULL DEFAULT 'ativo',
    ADD COLUMN situacao_desde DATE;
ALTER TABLE marca
    ADD COLUMN situacao situacao_ordem NOT NULL DEFAULT 'ativo',
    ADD COLUMN situacao_desde DATE;
ALTER TABLE nauta
    ADD COLUMN situacao situacao_ordem NOT NULL DEFAULT 'ativo',
    ADD COLUMN situacao_desde DATE;

-- Falecimento vale para as três Ordens: fica no cadastro do irmão.
ALTER TABLE macom ADD COLUMN data_falecimento DATE;

-- ---------- 4) lançamentos: número e forma de pagamento ----------
-- Número sequencial único, atribuído pelo banco e nunca reaproveitado: identifica o
-- lançamento no extrato, no histórico e no recibo. Buracos na sequência indicam exclusões.
ALTER TABLE lancamento_caixa ADD COLUMN numero BIGINT GENERATED ALWAYS AS IDENTITY;
CREATE UNIQUE INDEX lancamento_caixa_numero_key ON lancamento_caixa (numero);

-- Opcional e apenas informativa: o saldo continua único por Ordem.
CREATE TYPE forma_pagamento AS ENUM ('dinheiro', 'pix', 'transferencia', 'cartao', 'cheque', 'outro');
ALTER TABLE lancamento_caixa ADD COLUMN forma_pagamento forma_pagamento;

-- ---------- 5) fechamento do caixa ----------
-- Uma linha por Ordem com a data até a qual o caixa está fechado. Lançamentos com data
-- até essa data não podem ser criados, alterados nem excluídos. Sem linha, nada está fechado.
CREATE TABLE caixa_fechamento (
    ordem ordem_inglesa PRIMARY KEY,
    fechado_ate DATE NOT NULL,
    definido_por_email TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_caixa_fechamento_updated_at BEFORE UPDATE ON caixa_fechamento
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE caixa_fechamento ENABLE ROW LEVEL SECURITY;
CREATE POLICY oficiais_leem_caixa_fechamento ON caixa_fechamento
    FOR SELECT TO authenticated USING ((SELECT public.papel_atual()) IS NOT NULL);
-- Fechar e reabrir é decisão de administrador.
CREATE POLICY administradores_gravam_caixa_fechamento ON caixa_fechamento
    FOR ALL TO authenticated USING ((SELECT public.e_administrador())) WITH CHECK ((SELECT public.e_administrador()));
REVOKE ALL ON caixa_fechamento FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON caixa_fechamento TO authenticated;
GRANT ALL ON caixa_fechamento TO service_role;

-- SQLSTATE próprio (KS001) para a aplicação reconhecer a recusa e explicar ao oficial.
CREATE FUNCTION barrar_periodo_fechado()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_limite DATE;
BEGIN
    IF TG_OP <> 'INSERT' THEN
        SELECT f.fechado_ate INTO v_limite FROM public.caixa_fechamento AS f WHERE f.ordem = OLD.ordem;
        IF v_limite IS NOT NULL AND OLD.data <= v_limite THEN
            RAISE EXCEPTION 'Caixa fechado até %', to_char(v_limite, 'DD/MM/YYYY') USING ERRCODE = 'KS001';
        END IF;
    END IF;
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    v_limite := NULL;
    SELECT f.fechado_ate INTO v_limite FROM public.caixa_fechamento AS f WHERE f.ordem = NEW.ordem;
    IF v_limite IS NOT NULL AND NEW.data <= v_limite THEN
        RAISE EXCEPTION 'Caixa fechado até %', to_char(v_limite, 'DD/MM/YYYY') USING ERRCODE = 'KS001';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_lancamento_caixa_fechado BEFORE INSERT OR UPDATE OR DELETE ON lancamento_caixa
    FOR EACH ROW EXECUTE FUNCTION barrar_periodo_fechado();

-- ---------- 6) histórico dos lançamentos ----------
-- Edição e exclusão continuam permitidas (em período aberto), mas nada some sem rastro:
-- cada criação, alteração e exclusão grava quem fez, quando e o conteúdo antes e depois.
CREATE TABLE lancamento_caixa_historico (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lancamento_id UUID NOT NULL,
    numero BIGINT,
    operacao TEXT NOT NULL CHECK (operacao IN ('criado', 'alterado', 'excluido')),
    antes JSONB,
    depois JSONB,
    por UUID,
    por_email TEXT,
    em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_lancamento_caixa_historico_lancamento ON lancamento_caixa_historico (lancamento_id, em DESC);
CREATE INDEX idx_lancamento_caixa_historico_em ON lancamento_caixa_historico (em DESC);

CREATE FUNCTION registrar_historico_lancamento()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_email TEXT := auth.jwt() ->> 'email';
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.lancamento_caixa_historico (lancamento_id, numero, operacao, depois, por, por_email)
        VALUES (NEW.id, NEW.numero, 'criado', to_jsonb(NEW), auth.uid(), v_email);
    ELSIF TG_OP = 'UPDATE' THEN
        IF (to_jsonb(NEW) - 'updated_at') IS DISTINCT FROM (to_jsonb(OLD) - 'updated_at') THEN
            INSERT INTO public.lancamento_caixa_historico (lancamento_id, numero, operacao, antes, depois, por, por_email)
            VALUES (NEW.id, NEW.numero, 'alterado', to_jsonb(OLD), to_jsonb(NEW), auth.uid(), v_email);
        END IF;
    ELSE
        INSERT INTO public.lancamento_caixa_historico (lancamento_id, numero, operacao, antes, por, por_email)
        VALUES (OLD.id, OLD.numero, 'excluido', to_jsonb(OLD), auth.uid(), v_email);
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_lancamento_caixa_historico AFTER INSERT OR UPDATE OR DELETE ON lancamento_caixa
    FOR EACH ROW EXECUTE FUNCTION registrar_historico_lancamento();

ALTER TABLE lancamento_caixa_historico ENABLE ROW LEVEL SECURITY;
-- Só leitura: quem grava é o gatilho. Ninguém altera nem apaga o histórico pela API.
CREATE POLICY oficiais_leem_lancamento_caixa_historico ON lancamento_caixa_historico
    FOR SELECT TO authenticated USING ((SELECT public.papel_atual()) IS NOT NULL);
REVOKE ALL ON lancamento_caixa_historico FROM anon, authenticated;
GRANT SELECT ON lancamento_caixa_historico TO authenticated;
GRANT ALL ON lancamento_caixa_historico TO service_role;

REVOKE EXECUTE ON FUNCTION barrar_periodo_fechado(), registrar_historico_lancamento() FROM PUBLIC, anon, authenticated;
