CREATE TYPE potencia_simbolica AS ENUM ('GOB', 'CMSB', 'COMAB');

CREATE TABLE loja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    potencia_simbolica potencia_simbolica NOT NULL,
    endereco TEXT
);

CREATE TABLE macom (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    foto TEXT,
    nome TEXT NOT NULL,
    data_nascimento DATE,
    cpf TEXT NOT NULL UNIQUE,
    telefone TEXT,
    email TEXT,
    endereco TEXT,
    cep TEXT,
    cim TEXT,
    data_iniciacao DATE,
    data_passagem DATE,
    data_elevacao DATE,
    data_instalacao_mi DATE,
    loja_id UUID REFERENCES loja(id)
);

CREATE TABLE arco_real (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    macom_id UUID NOT NULL UNIQUE REFERENCES macom(id),
    nome_capitulo TEXT,
    proposto_por TEXT,
    secundado_por TEXT,
    data_exaltacao DATE,
    data_instalacao_3p DATE,
    data_instalacao_2p DATE,
    data_instalacao_1p DATE
);

CREATE TABLE marca (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    macom_id UUID NOT NULL UNIQUE REFERENCES macom(id),
    nome_loja_marca TEXT,
    proposto_por TEXT,
    secundado_por TEXT,
    data_avancamento DATE,
    data_instalacao_vm DATE,
    marca_candidato TEXT
);

CREATE TABLE nauta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    macom_id UUID NOT NULL UNIQUE REFERENCES macom(id),
    nome_loja_nauta TEXT,
    data_elevacao DATE,
    data_instalacao_vc DATE
);

CREATE INDEX idx_macom_loja_id ON macom(loja_id);
