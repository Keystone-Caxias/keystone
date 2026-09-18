-- 002 · Preparação para o app (Supabase + Vercel)
-- 1) carimbos de auditoria em todas as tabelas
-- 2) exclusão de maçom apaga os registros de Ordem dependentes (1:0..1)
-- 3) RLS: somente usuários autenticados (oficiais) leem e escrevem

-- ---------- 1) created_at / updated_at ----------
ALTER TABLE loja
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE macom
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE arco_real
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE marca
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE nauta
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_loja_updated_at ON loja;
CREATE TRIGGER trg_loja_updated_at BEFORE UPDATE ON loja
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_macom_updated_at ON macom;
CREATE TRIGGER trg_macom_updated_at BEFORE UPDATE ON macom
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_arco_real_updated_at ON arco_real;
CREATE TRIGGER trg_arco_real_updated_at BEFORE UPDATE ON arco_real
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_marca_updated_at ON marca;
CREATE TRIGGER trg_marca_updated_at BEFORE UPDATE ON marca
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_nauta_updated_at ON nauta;
CREATE TRIGGER trg_nauta_updated_at BEFORE UPDATE ON nauta
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- 2) cascata nas FKs das Ordens (nomes gerados pelo Postgres na migration 001) ----------
ALTER TABLE arco_real DROP CONSTRAINT IF EXISTS arco_real_macom_id_fkey;
ALTER TABLE arco_real ADD CONSTRAINT arco_real_macom_id_fkey
    FOREIGN KEY (macom_id) REFERENCES macom(id) ON DELETE CASCADE;
ALTER TABLE marca DROP CONSTRAINT IF EXISTS marca_macom_id_fkey;
ALTER TABLE marca ADD CONSTRAINT marca_macom_id_fkey
    FOREIGN KEY (macom_id) REFERENCES macom(id) ON DELETE CASCADE;
ALTER TABLE nauta DROP CONSTRAINT IF EXISTS nauta_macom_id_fkey;
ALTER TABLE nauta ADD CONSTRAINT nauta_macom_id_fkey
    FOREIGN KEY (macom_id) REFERENCES macom(id) ON DELETE CASCADE;
-- macom.loja_id mantém NO ACTION: uma loja com irmãos vinculados não pode ser excluída.

-- ---------- 3) Row Level Security ----------
ALTER TABLE loja      ENABLE ROW LEVEL SECURITY;
ALTER TABLE macom     ENABLE ROW LEVEL SECURITY;
ALTER TABLE arco_real ENABLE ROW LEVEL SECURITY;
ALTER TABLE marca     ENABLE ROW LEVEL SECURITY;
ALTER TABLE nauta     ENABLE ROW LEVEL SECURITY;

-- Uma política por tabela: qualquer usuário autenticado (oficial) lê e escreve tudo.
-- O papel anon (chave pública sem sessão) não tem acesso a nenhuma linha.
DROP POLICY IF EXISTS autenticados_tudo_loja ON loja;
CREATE POLICY autenticados_tudo_loja ON loja
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS autenticados_tudo_macom ON macom;
CREATE POLICY autenticados_tudo_macom ON macom
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS autenticados_tudo_arco_real ON arco_real;
CREATE POLICY autenticados_tudo_arco_real ON arco_real
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS autenticados_tudo_marca ON marca;
CREATE POLICY autenticados_tudo_marca ON marca
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS autenticados_tudo_nauta ON nauta;
CREATE POLICY autenticados_tudo_nauta ON nauta
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
