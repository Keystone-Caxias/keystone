'use client';
import { useState, useTransition } from 'react';
import { Button, Card, Input, Tag, Toast } from '@/ds';
import { ORDENS, formatarData, formatarDataHora } from '@/lib/formatar';
import { salvarFechamento } from './actions';

function LinhaOrdem({ ordem, fechamento, administrador, hoje, aoSalvar }) {
  const [pendente, iniciar] = useTransition();
  const [data, setData] = useState(fechamento?.ate ?? '');
  const [erro, setErro] = useState(null);
  const gravar = (valor) => {
    const dados = new FormData();
    dados.set('ordem', ordem);
    dados.set('fechado_ate', valor);
    iniciar(async () => {
      const r = await salvarFechamento(dados);
      if (r?.erro) { setErro(r.erro); return; }
      setErro(null);
      setData(valor);
      aoSalvar(valor
        ? ['Caixa fechado', `${ORDENS[ordem]}: lançamentos até ${formatarData(valor)} não podem mais ser alterados.`]
        : ['Caixa reaberto', `${ORDENS[ordem]}: todos os lançamentos voltam a aceitar alterações.`]);
    });
  };
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)', padding: 'var(--space-4) 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px', display: 'grid', gap: 4 }}>
          <span><Tag order={ordem}>{ORDENS[ordem]}</Tag></span>
          <span className="numeric" style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>
            {fechamento?.ate
              ? `Fechado até ${formatarData(fechamento.ate)}${fechamento.por ? ` por ${fechamento.por}` : ''} em ${formatarDataHora(fechamento.em)}`
              : 'Caixa aberto: nenhum período fechado.'}
          </span>
        </div>
        {administrador && (
          <>
            <Input label="Fechar até" type="date" value={data} max={hoje} onChange={(e) => setData(e.target.value)} wrapperStyle={{ width: 170 }} />
            <Button variant="secondary" iconLeft="check" disabled={pendente || !data || data === fechamento?.ate} onClick={() => gravar(data)}>Fechar período</Button>
            <Button variant="ghost" disabled={pendente || !fechamento?.ate} onClick={() => gravar('')}>Reabrir caixa</Button>
          </>
        )}
      </div>
      {erro && <p role="alert" style={{ color: 'var(--status-danger-fg)', fontSize: 'var(--fs-sm)' }}>{erro}</p>}
    </div>
  );
}

/** Fechamento do caixa por Ordem: até a data definida, lançamentos não são criados, alterados nem excluídos. */
export function FechamentoCaixa({ fechamentos, administrador, hoje }) {
  const [toast, setToast] = useState(null);
  return (
    <>
      <Card eyebrow="Tesouraria" title="Fechamento do caixa">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', maxWidth: 'var(--width-form-max)' }}>
            Depois de prestar contas de um período, feche o caixa da Ordem até a data final dele. Lançamentos com data até o fechamento ficam travados
            (o banco recusa criar, alterar e excluir). Para corrigir algo de um período fechado, um administrador reabre o caixa ou o oficial lança o ajuste com data posterior.
            {administrador ? '' : ' Somente administradores fecham e reabrem o caixa.'}
          </p>
          <div style={{ display: 'grid', marginBottom: 'calc(var(--space-4) * -1)' }}>
            {Object.keys(ORDENS).map((o) => <LinhaOrdem key={`${o}-${fechamentos[o]?.ate ?? ''}`} ordem={o} fechamento={fechamentos[o]} administrador={administrador} hoje={hoje} aoSalvar={setToast} />)}
          </div>
        </div>
      </Card>
      {toast && (
        <div style={{ position: 'fixed', right: 'var(--space-6)', bottom: 'var(--space-6)', zIndex: 40 }}>
          <Toast tone="success" title={toast[0]} description={toast[1]} onClose={() => setToast(null)} />
        </div>
      )}
    </>
  );
}
