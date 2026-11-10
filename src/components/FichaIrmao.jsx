import { ORDENS, formatarCpf, formatarData } from '@/lib/formatar';
import { Aviso, Folha, Secao } from './Folha';

/** Modelos de ficha. As chaves de Ordem são as mesmas do resto da interface. */
export const MODELOS_FICHA = {
  cadastral: 'Ficha cadastral',
  'arco-real': 'Arco Real',
  marca: 'Mestre da Marca',
  nautas: 'Nautas da Arca Real',
};

/** Modelo vindo da URL: devolve um modelo válido (padrão: cadastral). */
export function lerModeloFicha(valor) {
  return typeof valor === 'string' && Object.hasOwn(MODELOS_FICHA, valor) ? valor : 'cadastral';
}

const grade = { display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '10px 14px' };

/** Rótulo em versalete sobre uma linha: com valor, preenchida; sem valor, em branco para a caneta. */
function Campo({ rotulo, valor, colunas = 4 }) {
  return (
    <div style={{ gridColumn: `span ${colunas}`, display: 'grid', gap: 3, minWidth: 0 }}>
      <span style={{ fontSize: 8.5, fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{rotulo}</span>
      <span style={{ minHeight: 21, paddingBottom: 2, borderBottom: 'var(--border-strong)', fontSize: 13, lineHeight: '18px', color: 'var(--text-strong)', overflowWrap: 'anywhere' }}>{valor || ' '}</span>
    </div>
  );
}

const data = (iso) => (iso ? formatarData(iso) : null);

/** Quadro 3x4: mostra a foto do cadastro (URL http/https) ou fica em branco para colar a foto. */
function Foto({ url }) {
  const valida = typeof url === 'string' && /^https?:\/\//i.test(url);
  return (
    <div style={{ flex: '0 0 auto', boxSizing: 'border-box', width: '30mm', height: '40mm', marginRight: 1, border: 'var(--border-strong)', display: 'grid', placeItems: 'center',
      backgroundImage: valida ? `url(${JSON.stringify(url)})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {!valida && <span style={{ fontSize: 8.5, letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Foto</span>}
    </div>
  );
}

function Identificacao({ irmao }) {
  return (
    <Secao titulo="Identificação">
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ ...grade, flex: 1 }}>
          <Campo rotulo="Nome completo" valor={irmao.nome} colunas={12} />
          <Campo rotulo="CPF" valor={formatarCpf(irmao.cpf)} />
          <Campo rotulo="CIM" valor={irmao.cim} />
          <Campo rotulo="Data de nascimento" valor={data(irmao.data_nascimento)} />
          <Campo rotulo="E-mail" valor={irmao.email} colunas={7} />
          <Campo rotulo="Telefone" valor={irmao.telefone} colunas={5} />
          <Campo rotulo="Endereço" valor={irmao.endereco} colunas={9} />
          <Campo rotulo="CEP" valor={irmao.cep} colunas={3} />
        </div>
        <Foto url={irmao.foto} />
      </div>
    </Secao>
  );
}

function LojaSimbolica({ irmao }) {
  return (
    <Secao titulo="Loja simbólica">
      <div style={grade}>
        <Campo rotulo="Loja (Craft)" valor={irmao.loja?.nome} colunas={9} />
        <Campo rotulo="Potência" valor={irmao.loja?.potencia_simbolica} colunas={3} />
        <Campo rotulo="Iniciação" valor={data(irmao.data_iniciacao)} colunas={3} />
        <Campo rotulo="Passagem" valor={data(irmao.data_passagem)} colunas={3} />
        <Campo rotulo="Elevação" valor={data(irmao.data_elevacao)} colunas={3} />
        <Campo rotulo="Instalação (MI)" valor={data(irmao.data_instalacao_mi)} colunas={3} />
      </div>
    </Secao>
  );
}

function ArcoReal({ r }) {
  return (
    <Secao titulo="Arco Real">
      <div style={grade}>
        <Campo rotulo="Capítulo" valor={r.nome_capitulo} colunas={8} />
        <Campo rotulo="Exaltação" valor={data(r.data_exaltacao)} />
        <Campo rotulo="Proposto por" valor={r.proposto_por} colunas={6} />
        <Campo rotulo="Secundado por" valor={r.secundado_por} colunas={6} />
        <Campo rotulo="Instalação 3º P" valor={data(r.data_instalacao_3p)} />
        <Campo rotulo="Instalação 2º P" valor={data(r.data_instalacao_2p)} />
        <Campo rotulo="Instalação 1º P" valor={data(r.data_instalacao_1p)} />
      </div>
    </Secao>
  );
}

function Marca({ r }) {
  return (
    <Secao titulo="Mestre Maçom da Marca">
      <div style={grade}>
        <Campo rotulo="Loja de Mestre Maçom da Marca" valor={r.nome_loja_marca} colunas={8} />
        <Campo rotulo="Avançamento" valor={data(r.data_avancamento)} />
        <Campo rotulo="Proposto por" valor={r.proposto_por} colunas={6} />
        <Campo rotulo="Secundado por" valor={r.secundado_por} colunas={6} />
        <Campo rotulo="Marca do candidato" valor={r.marca_candidato} colunas={8} />
        <Campo rotulo="Instalação VM" valor={data(r.data_instalacao_vm)} />
      </div>
    </Secao>
  );
}

function Nautas({ r }) {
  return (
    <Secao titulo="Nautas da Arca Real">
      <div style={grade}>
        <Campo rotulo="Loja de Nautas da Arca Real" valor={r.nome_loja_nauta} colunas={12} />
        <Campo rotulo="Elevação" valor={data(r.data_elevacao)} colunas={6} />
        <Campo rotulo="Instalação VC" valor={data(r.data_instalacao_vc)} colunas={6} />
      </div>
    </Secao>
  );
}

/**
 * Ficha de um irmão em uma Folha A4.
 * - `cadastral`: identificação, loja simbólica e as Ordens em que o irmão tem registro.
 * - `arco-real` | `marca` | `nautas`: identificação, loja simbólica e o bloco daquela Ordem;
 *   se o irmão ainda não tem registro nela, o bloco sai em branco (serve de ficha de proposta).
 *
 * Layout provisório: os modelos oficiais de cada Ordem ainda não foram recebidos
 * (spec 002, pergunta "FICHAS, modelos"). Para reproduzi-los, este é o arquivo a trocar.
 */
export function FichaIrmao({ irmao, modelo = 'cadastral', emissao }) {
  const cadastral = modelo === 'cadastral';
  const mostrar = (ordem) => (cadastral ? irmao.ordens.includes(ordem) : modelo === ordem);
  return (
    <Folha ordem={cadastral ? undefined : modelo} emissao={emissao}
      eyebrow={cadastral ? 'Cadastro de irmãos' : ORDENS[modelo]}
      titulo={cadastral ? 'Ficha cadastral' : 'Ficha de registro'}
      subtitulo={irmao.nome}>
      <Identificacao irmao={irmao} />
      <LojaSimbolica irmao={irmao} />
      {mostrar('arco-real') && <ArcoReal r={irmao.arco_real || {}} />}
      {mostrar('marca') && <Marca r={irmao.marca || {}} />}
      {mostrar('nautas') && <Nautas r={irmao.nauta || {}} />}
      {cadastral && irmao.ordens.length === 0 && (
        <Secao titulo="Ordens Inglesas"><Aviso>Sem registro de Arco Real, Marca ou Nautas para este irmão.</Aviso></Secao>
      )}
    </Folha>
  );
}
