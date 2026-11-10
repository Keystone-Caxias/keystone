'use client';
import { useState } from 'react';
import { Button, Card, Checkbox, Input, Select } from '@/ds';
import { LinkButton } from '@/components/LinkButton';
import { useEnvio } from '@/lib/useEnvio';
import { salvarIrmao } from './actions';

const grade = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' };

export function IrmaoForm({ irmao, lojas }) {
  // useEnvio: se o salvamento devolver erro (CPF repetido, por exemplo), o formulário não é limpo.
  const [state, enviar, pending] = useEnvio(salvarIrmao);
  const [temAR, setTemAR] = useState(Boolean(irmao?.arco_real));
  const [temMarca, setTemMarca] = useState(Boolean(irmao?.marca));
  const [temNauta, setTemNauta] = useState(Boolean(irmao?.nauta));
  const ar = irmao?.arco_real || {};
  const ma = irmao?.marca || {};
  const na = irmao?.nauta || {};

  return (
    <form onSubmit={enviar} style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 'var(--width-form-max)' }}>
      {irmao && <input type="hidden" name="id" value={irmao.id} />}

      <Card eyebrow="Identificação" title="Dados básicos">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Input label="Nome completo" name="nome" defaultValue={irmao?.nome ?? ''} required autoFocus />
          <div style={grade}>
            <Input label="CPF" name="cpf" defaultValue={irmao?.cpf ?? ''} inputMode="numeric" placeholder="Somente números" required hint="11 dígitos" />
            <Input label="CIM" name="cim" defaultValue={irmao?.cim ?? ''} />
            <Input label="Data de nascimento" name="data_nascimento" type="date" defaultValue={irmao?.data_nascimento ?? ''} />
          </div>
          <div style={grade}>
            <Input label="E-mail" name="email" type="email" defaultValue={irmao?.email ?? ''} />
            <Input label="Telefone" name="telefone" defaultValue={irmao?.telefone ?? ''} />
          </div>
          <div style={grade}>
            <Input label="Endereço" name="endereco" defaultValue={irmao?.endereco ?? ''} wrapperStyle={{ gridColumn: '1 / -1' }} />
            <Input label="CEP" name="cep" defaultValue={irmao?.cep ?? ''} />
            <Input label="Foto (URL)" name="foto" type="url" defaultValue={irmao?.foto ?? ''} hint="Endereço da imagem no armazenamento externo" />
          </div>
        </div>
      </Card>

      <Card eyebrow="Loja simbólica" title="Loja e datas do grau simbólico">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Select label="Loja (Craft)" name="loja_id" defaultValue={irmao?.loja_id ?? ''} placeholder="Sem loja vinculada"
            options={lojas.map((l) => ({ value: l.id, label: `${l.nome} · ${l.potencia_simbolica}` }))}
            hint={lojas.length === 0 ? 'Nenhuma loja cadastrada ainda. Cadastre em Lojas.' : undefined} />
          <div style={grade}>
            <Input label="Iniciação" name="data_iniciacao" type="date" defaultValue={irmao?.data_iniciacao ?? ''} />
            <Input label="Passagem" name="data_passagem" type="date" defaultValue={irmao?.data_passagem ?? ''} />
            <Input label="Elevação" name="data_elevacao" type="date" defaultValue={irmao?.data_elevacao ?? ''} />
            <Input label="Instalação (MI)" name="data_instalacao_mi" type="date" defaultValue={irmao?.data_instalacao_mi ?? ''} />
          </div>
        </div>
      </Card>

      <Card eyebrow="Ordem" title="Arco Real" accent="arco-real">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Checkbox name="tem_arco_real" label="Companheiro exaltado ao Arco Real" checked={temAR} onChange={(e) => setTemAR(e.target.checked)} />
          {temAR && (
            <>
              <Input label="Capítulo" name="ar_nome_capitulo" defaultValue={ar.nome_capitulo ?? ''} />
              <div style={grade}>
                <Input label="Proposto por" name="ar_proposto_por" defaultValue={ar.proposto_por ?? ''} />
                <Input label="Secundado por" name="ar_secundado_por" defaultValue={ar.secundado_por ?? ''} />
              </div>
              <div style={grade}>
                <Input label="Exaltação" name="ar_data_exaltacao" type="date" defaultValue={ar.data_exaltacao ?? ''} />
                <Input label="Instalação 3º P" name="ar_data_instalacao_3p" type="date" defaultValue={ar.data_instalacao_3p ?? ''} />
                <Input label="Instalação 2º P" name="ar_data_instalacao_2p" type="date" defaultValue={ar.data_instalacao_2p ?? ''} />
                <Input label="Instalação 1º P" name="ar_data_instalacao_1p" type="date" defaultValue={ar.data_instalacao_1p ?? ''} />
              </div>
            </>
          )}
        </div>
      </Card>

      <Card eyebrow="Ordem" title="Mestre Maçom da Marca" accent="marca">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Checkbox name="tem_marca" label="Avançado ao grau de Mestre da Marca" checked={temMarca} onChange={(e) => setTemMarca(e.target.checked)} />
          {temMarca && (
            <>
              <Input label="Loja de Mestre Maçom da Marca" name="ma_nome_loja_marca" defaultValue={ma.nome_loja_marca ?? ''} />
              <div style={grade}>
                <Input label="Proposto por" name="ma_proposto_por" defaultValue={ma.proposto_por ?? ''} />
                <Input label="Secundado por" name="ma_secundado_por" defaultValue={ma.secundado_por ?? ''} />
              </div>
              <div style={grade}>
                <Input label="Avançamento" name="ma_data_avancamento" type="date" defaultValue={ma.data_avancamento ?? ''} />
                <Input label="Instalação VM" name="ma_data_instalacao_vm" type="date" defaultValue={ma.data_instalacao_vm ?? ''} />
                <Input label="Marca do candidato" name="ma_marca_candidato" defaultValue={ma.marca_candidato ?? ''} />
              </div>
            </>
          )}
        </div>
      </Card>

      <Card eyebrow="Ordem" title="Nautas da Arca Real" accent="nautas">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Checkbox name="tem_nauta" label="Elevado a Nauta da Arca Real" checked={temNauta} onChange={(e) => setTemNauta(e.target.checked)} />
          {temNauta && (
            <>
              <Input label="Loja de Nautas da Arca Real" name="na_nome_loja_nauta" defaultValue={na.nome_loja_nauta ?? ''} />
              <div style={grade}>
                <Input label="Elevação" name="na_data_elevacao" type="date" defaultValue={na.data_elevacao ?? ''} />
                <Input label="Instalação VC" name="na_data_instalacao_vc" type="date" defaultValue={na.data_instalacao_vc ?? ''} />
              </div>
            </>
          )}
        </div>
      </Card>

      {state?.erro && (
        <p role="alert" style={{ color: 'var(--status-danger-fg)', fontSize: 'var(--fs-sm)' }}>{state.erro}</p>
      )}
      <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
        <LinkButton href="/cadastro" variant="secondary" type="button">Cancelar</LinkButton>
        <Button type="submit" iconLeft="check" disabled={pending}>{pending ? 'Salvando' : irmao ? 'Salvar alterações' : 'Cadastrar irmão'}</Button>
      </div>
    </form>
  );
}
