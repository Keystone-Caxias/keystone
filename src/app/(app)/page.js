import { Card } from '@/ds';
import { Conteudo } from '@/components/Conteudo';
import { LinkButton } from '@/components/LinkButton';
import { Metric } from '@/components/Metric';
import { Topbar } from '@/components/Topbar';
import { contagens, irmaosRecentes, listarLojas, membrosPorLoja } from '@/lib/dados';
import { createClient } from '@/lib/supabase/server';
import { PainelRecentes } from './PainelRecentes';

export const metadata = { title: 'Painel' };

export default async function PainelPage() {
  const supabase = await createClient();
  const [c, recentes, lojas, porLoja] = await Promise.all([
    contagens(supabase),
    irmaosRecentes(supabase, 6),
    listarLojas(supabase),
    membrosPorLoja(supabase),
  ]);
  const composicao = [
    ['arco-real', 'Arco Real', c.arco_real, 'var(--order-arco-real)'],
    ['marca', 'Mestre da Marca', c.marca, 'var(--order-marca)'],
    ['nautas', 'Nautas da Arca Real', c.nauta, 'var(--order-nautas)'],
  ];
  const maior = Math.max(1, ...composicao.map((x) => x[2]));
  const semOrdem = Math.max(0, c.macom - new Set().size);

  return (
    <>
      <Topbar eyebrow="Registro das três Ordens" title="Painel"
        actions={<LinkButton href="/cadastro/novo" size="sm" iconLeft="plus">Novo cadastro</LinkButton>} />
      <Conteudo>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
          <Metric eyebrow="Irmãos cadastrados" value={c.macom} hint={`${c.loja} ${c.loja === 1 ? 'loja' : 'lojas'} simbólicas`} />
          <Metric eyebrow="Arco Real" value={c.arco_real} hint="companheiros exaltados" />
          <Metric eyebrow="Mestre da Marca" value={c.marca} hint="mestres avançados" />
          <Metric eyebrow="Nautas" value={c.nauta} hint="nautas elevados" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(280px, 1fr)', gap: 'var(--space-6)', alignItems: 'start' }}>
          <Card eyebrow="Cadastro" title="Últimos cadastros" padding="0"
            actions={<LinkButton href="/cadastro" size="sm" variant="ghost" iconRight="arrow-right">Ver todos</LinkButton>}>
            <div style={{ padding: 'var(--space-4) 0 var(--space-2)' }}>
              <PainelRecentes rows={recentes} />
            </div>
          </Card>
          <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
            <Card eyebrow="Composição" title="Irmãos por Ordem">
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {composicao.map(([k, label, n, cor]) => (
                  <div key={k} style={{ display: 'grid', gap: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-2xs)', color: 'var(--text-body)' }}>
                      <span>{label}</span><span className="numeric">{n}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)' }}>
                      <div style={{ width: `${(n / maior) * 100}%`, height: '100%', background: cor, borderRadius: 'var(--radius-pill)' }} />
                    </div>
                  </div>
                ))}
                {semOrdem === c.macom && c.macom > 0 && null}
              </div>
            </Card>
            <Card eyebrow="Lojas simbólicas" title="Irmãos por loja" accent="nautas"
              actions={<LinkButton href="/lojas" size="sm" variant="ghost" iconRight="arrow-right">Lojas</LinkButton>}>
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {lojas.length === 0 && <span style={{ color: 'var(--text-faint)', fontSize: 'var(--fs-sm)' }}>Nenhuma loja cadastrada.</span>}
                {lojas.map((l) => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'grid', gap: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.nome}</span>
                      <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text-muted)' }}>{l.potencia_simbolica}</span>
                    </div>
                    <span className="numeric" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-strong)' }}>{porLoja[l.id] ?? 0}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Conteudo>
    </>
  );
}
