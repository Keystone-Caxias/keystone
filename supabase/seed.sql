INSERT INTO loja (id, nome, potencia_simbolica, endereco) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Loja Acácia', 'GOB', 'Rua das Acácias, 100 - São Paulo/SP'),
    ('a0000000-0000-0000-0000-000000000002', 'Loja Estrela do Oriente', 'CMSB', 'Av. Central, 200 - Rio de Janeiro/RJ');

INSERT INTO macom (id, foto, nome, data_nascimento, cpf, telefone, email, endereco, cep, cim, data_iniciacao, data_passagem, data_elevacao, data_instalacao_mi, loja_id) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'https://storage.exemplo/fotos/joao.jpg', 'João da Silva', '1980-05-10', '11111111111', '11999990001', 'joao@exemplo.com', 'Rua A, 10', '01000-000', 'CIM001', '2005-03-01', '2005-09-01', '2006-03-01', NULL, 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000002', NULL, 'Carlos Pereira', '1975-11-22', '22222222222', '21999990002', 'carlos@exemplo.com', 'Rua B, 20', '20000-000', 'CIM002', '1998-06-15', '1999-01-10', '1999-07-20', '2010-02-01', 'a0000000-0000-0000-0000-000000000002'),
    ('b0000000-0000-0000-0000-000000000003', NULL, 'Marcos Souza', '1990-02-14', '33333333333', '11999990003', 'marcos@exemplo.com', 'Rua C, 30', '01500-000', 'CIM003', '2015-04-01', '2015-10-01', '2016-04-01', NULL, 'a0000000-0000-0000-0000-000000000001');

INSERT INTO arco_real (macom_id, nome_capitulo, proposto_por, secundado_por, data_exaltacao, data_instalacao_3p, data_instalacao_2p, data_instalacao_1p) VALUES
    ('b0000000-0000-0000-0000-000000000002', 'Capítulo União', 'João da Silva', 'Marcos Souza', '2011-05-01', '2012-05-01', '2013-05-01', '2014-05-01');

INSERT INTO marca (macom_id, nome_loja_marca, proposto_por, secundado_por, data_avancamento, data_instalacao_vm, marca_candidato) VALUES
    ('b0000000-0000-0000-0000-000000000002', 'Loja Marca do Oriente', 'João da Silva', 'Marcos Souza', '2011-08-01', '2015-08-01', 'MP-77');

INSERT INTO nauta (macom_id, nome_loja_nauta, data_elevacao, data_instalacao_vc) VALUES
    ('b0000000-0000-0000-0000-000000000002', 'Loja de Nautas da Arca Real', '2011-11-01', '2016-11-01');
