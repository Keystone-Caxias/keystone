'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, DataTable, IconButton, Input, RowActions, Select, Tabs, Tag, Toast, Tooltip } from '@/ds';
import { ORDEM_DB, ORDENS, SITUACOES, formatarCpf, formatarData } from '@/lib/formatar';

/** Etiqueta da Ordem; fora de 'ativo', acrescenta a situação do irmão nela. */
function TagOrdem({ irmao, ordem }) {
  const situacao = irmao[ORDEM_DB[ordem]]?.situacao;
  return <Tag order={ordem}>{ORDENS[ordem]}{situacao && situacao !== 'ativo' ? ` · ${SITUACOES[situacao].toLowerCase()}` : ''}</Tag>;
}

const MENSAGENS = {
  criado: ['Cadastro concluído', 'O irmão consta no registro.'],
  atualizado: ['Cadastro atualizado', 'As alterações foram gravadas.'],
  excluido: ['Cadastro excluído', 'O registro foi removido.'],
};

function Linha({ rotulo, valor }) {
  return (
    <div style={{ display: 'grid', gap: 2 }}>
      <span className="eyebrow">{rotulo}</span>
      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-strong)' }}>{valor ?? '—'}</span>
    </div>
  );
}

function Detalhe({ irmao, onClose }) {
  const router = useRouter();
  const [aba, setAba] = useState('dados');
  return (
    <aside style={{ width: 380, flex: '0 0 auto', background: 'var(--surface-card)', borderLeft: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
            <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {irmao.ordens.length === 0 ? <Tag>Grau simbólico</Tag> : irmao.ordens.map((o) => <TagOrdem key={o} irmao={irmao} ordem={o} />)}
              {irmao.data_falecimento && <Tag>Falecido em {formatarData(irmao.data_falecimento)}</Tag>}
            </span>
            <h3 style={{ fontSize: 'var(--fs-xl)' }}>{irmao.nome}</h3>
            <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{formatarCpf(irmao.cpf)}{irmao.cim ? ` · CIM ${irmao.cim}` : ''}</span>
          </div>
          <IconButton icon="x" label="Fechar" onClick={onClose} />
        </div>
      </div>
      <div style={{ padding: '0 var(--space-5)', marginTop: 'var(--space-4)' }}>
        <Tabs value={aba} onChange={setAba} items={[{ value: 'dados', label: 'Dados' }, { value: 'ordens', label: 'Ordens', count: irmao.ordens.length }]} />
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-5)', display: 'grid', gap: 'var(--space-4)', alignContent: 'start' }}>
        {aba === 'dados' && (
          <>
            <Linha rotulo="Loja simbólica" valor={irmao.loja ? `${irmao.loja.nome} · ${irmao.loja.potencia_simbolica}` : null} />
            <Linha rotulo="E-mail" valor={irmao.email} />
            <Linha rotulo="Telefone" valor={irmao.telefone} />
            <Linha rotulo="Nascimento" valor={irmao.data_nascimento ? formatarData(irmao.data_nascimento) : null} />
            <Linha rotulo="Endereço" valor={irmao.endereco ? `${irmao.endereco}${irmao.cep ? ` · ${irmao.cep}` : ''}` : null} />
            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
            <Linha rotulo="Iniciação" valor={irmao.data_iniciacao ? formatarData(irmao.data_iniciacao) : null} />
            <Linha rotulo="Passagem" valor={irmao.data_passagem ? formatarData(irmao.data_passagem) : null} />
            <Linha rotulo="Elevação" valor={irmao.data_elevacao ? formatarData(irmao.data_elevacao) : null} />
            <Linha rotulo="Instalação (MI)" valor={irmao.data_instalacao_mi ? formatarData(irmao.data_instalacao_mi) : null} />
            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button size="sm" iconLeft="pencil" onClick={() => router.push(`/cadastro/${irmao.id}/editar`)}>Editar cadastro</Button>
              <Button size="sm" variant="secondary" iconLeft="printer" onClick={() => router.push(`/imprimir/ficha/${irmao.id}`)}>Emitir ficha</Button>
            </div>
          </>
        )}
        {aba === 'ordens' && irmao.ordens.length === 0 && (
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-faint)' }}>Nenhum registro de Ordem Inglesa para este irmão.</span>
        )}
        {aba === 'ordens' && irmao.arco_real && (
          <Card eyebrow="Arco Real" title={irmao.arco_real.nome_capitulo || 'Capítulo não informado'} accent="arco-real" padding="var(--space-4)">
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <Linha rotulo="Exaltação" valor={formatarData(irmao.arco_real.data_exaltacao)} />
              <Linha rotulo="Proposto / secundado por" valor={[irmao.arco_real.proposto_por, irmao.arco_real.secundado_por].filter(Boolean).join(' / ') || null} />
              <Linha rotulo="Instalações 3º P · 2º P · 1º P" valor={[irmao.arco_real.data_instalacao_3p, irmao.arco_real.data_instalacao_2p, irmao.arco_real.data_instalacao_1p].map(formatarData).join(' · ')} />
            </div>
          </Card>
        )}
        {aba === 'ordens' && irmao.marca && (
          <Card eyebrow="Mestre Maçom da Marca" title={irmao.marca.nome_loja_marca || 'Loja não informada'} accent="marca" padding="var(--space-4)">
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <Linha rotulo="Avançamento" valor={formatarData(irmao.marca.data_avancamento)} />
              <Linha rotulo="Proposto / secundado por" valor={[irmao.marca.proposto_por, irmao.marca.secundado_por].filter(Boolean).join(' / ') || null} />
              <Linha rotulo="Instalação VM" valor={formatarData(irmao.marca.data_instalacao_vm)} />
              <Linha rotulo="Marca do candidato" valor={irmao.marca.marca_candidato} />
            </div>
          </Card>
        )}
        {aba === 'ordens' && irmao.nauta && (
          <Card eyebrow="Nautas da Arca Real" title={irmao.nauta.nome_loja_nauta || 'Loja não informada'} accent="nautas" padding="var(--space-4)">
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <Linha rotulo="Elevação" valor={formatarData(irmao.nauta.data_elevacao)} />
              <Linha rotulo="Instalação VC" valor={formatarData(irmao.nauta.data_instalacao_vc)} />
            </div>
          </Card>
        )}
      </div>
    </aside>
  );
}

export function CadastroLista({ irmaos, lojas, mensagem }) {
  const router = useRouter();
  const [sel, setSel] = useState(null);
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState('');
  const [lojaId, setLojaId] = useState('');
  const [toast, setToast] = useState(MENSAGENS[mensagem] || null);

  const rows = useMemo(() => {
    const q = busca.trim().toLowerCase();
    const qDigitos = q.replace(/\D/g, '');
    return irmaos.filter((i) => {
      if (ordem && !i.ordens.includes(ordem)) return false;
      if (lojaId && i.loja_id !== lojaId) return false;
      if (!q) return true;
      return i.nome.toLowerCase().includes(q)
        || (qDigitos.length >= 3 && i.cpf.includes(qDigitos))
        || (i.cim || '').toLowerCase().includes(q);
    });
  }, [irmaos, busca, ordem, lojaId]);

  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
      <div style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: 'var(--space-6)' }}>
        <Card padding="0" style={{ maxWidth: 'var(--width-content-max)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
            <Input placeholder="Buscar por nome, CPF ou CIM" iconLeft="search" value={busca} onChange={(e) => setBusca(e.target.value)} wrapperStyle={{ flex: '1 1 240px' }} />
            <Select placeholder="Todas as Ordens" value={ordem} onChange={(e) => setOrdem(e.target.value)} options={Object.entries(ORDENS).map(([v, l]) => ({ value: v, label: l }))} wrapperStyle={{ width: 200 }} />
            <Select placeholder="Todas as lojas" value={lojaId} onChange={(e) => setLojaId(e.target.value)} options={lojas.map((l) => ({ value: l.id, label: l.nome }))} wrapperStyle={{ width: 220 }} />
          </div>
          <div style={{ padding: 'var(--space-4) 0' }}>
            <DataTable rows={rows} selectedId={sel && sel.id} onRowClick={(r) => setSel(sel && sel.id === r.id ? null : r)} empty="Nenhum irmão encontrado com esses critérios."
              columns={[
                { key: 'nome', label: 'Irmão', strong: true },
                { key: 'cpf', label: 'CPF', numeric: true, render: (r) => formatarCpf(r.cpf) },
                { key: 'loja', label: 'Loja', render: (r) => r.loja?.nome ?? '—' },
                { key: 'ordens', label: 'Ordens', render: (r) => (
                  <span style={{ display: 'inline-flex', gap: 6 }}>
                    {r.ordens.length === 0 ? <span style={{ color: 'var(--text-faint)' }}>—</span> : r.ordens.map((o) => <TagOrdem key={o} irmao={r} ordem={o} />)}
                    {r.data_falecimento && <Tag>Falecido</Tag>}
                  </span>
                ) },
                { key: 'data_iniciacao', label: 'Iniciação', numeric: true, render: (r) => formatarData(r.data_iniciacao) },
                { key: 'acoes', label: '', align: 'right', render: (r) => (
                  <RowActions>
                    <Tooltip label="Emitir ficha"><IconButton icon="printer" label="Emitir ficha" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/imprimir/ficha/${r.id}`); }} /></Tooltip>
                    <Tooltip label="Editar"><IconButton icon="pencil" label="Editar" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/cadastro/${r.id}/editar`); }} /></Tooltip>
                  </RowActions>
                ) },
              ]} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)' }}>
            <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{rows.length} de {irmaos.length} registros</span>
          </div>
        </Card>
      </div>
      {sel && <Detalhe irmao={sel} onClose={() => setSel(null)} />}
      {toast && (
        <div style={{ position: 'absolute', right: 'var(--space-6)', bottom: 'var(--space-6)', zIndex: 40 }}>
          <Toast tone="success" title={toast[0]} description={toast[1]} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}
