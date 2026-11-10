import { Button, Card, Input, Select } from '@/ds';
import { Conteudo } from '@/components/Conteudo';
import { LinkButton } from '@/components/LinkButton';
import { Topbar } from '@/components/Topbar';
import { contagens } from '@/lib/dados';
import { ORDEM_DB, ORDENS, periodoDoAno } from '@/lib/formatar';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Relatórios' };

const texto = { fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', maxWidth: 'var(--width-form-max)' };
const botoes = { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' };

/** Um botão por Ordem, com a quantidade de irmãos registrados nela. */
function PorOrdem({ destino, c }) {
  return (
    <div style={botoes}>
      {Object.entries(ORDENS).map(([ordem, nome]) => {
        const n = c[ORDEM_DB[ordem]] ?? 0;
        return (
          <LinkButton key={ordem} href={`${destino}?ordem=${ordem}`} variant="secondary" iconLeft="printer" disabled={n === 0}>
            {nome} · {n} {n === 1 ? 'irmão' : 'irmãos'}
          </LinkButton>
        );
      })}
    </div>
  );
}

export default async function RelatoriosPage() {
  const supabase = await createClient();
  const c = await contagens(supabase);
  const periodo = periodoDoAno();
  return (
    <>
      <Topbar eyebrow="Documentos para impressão" title="Relatórios" />
      <Conteudo>
        <Card eyebrow="Cadastro" title="Fichas de registro">
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <p style={texto}>Uma ficha por irmão da Ordem, preenchida com os dados do cadastro, uma por página. Para a ficha de um único irmão, abra o Cadastro e use Emitir ficha.</p>
            <PorOrdem destino="/imprimir/fichas" c={c} />
          </div>
        </Card>
        <Card eyebrow="Cadastro" title="Quadro de irmãos">
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <p style={texto}>Lista nominal dos irmãos com registro na Ordem, com loja simbólica, data de ingresso e telefone.</p>
            <PorOrdem destino="/imprimir/quadro" c={c} />
          </div>
        </Card>
        <Card eyebrow="Tesouraria" title="Extrato do caixa">
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <p style={texto}>Saldo anterior, lançamentos em ordem de data com saldo acumulado, totais e saldo final. Sem escolher a Ordem, sai uma folha para cada uma.</p>
            <form action="/imprimir/extrato" method="get" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <input type="hidden" name="origem" value="relatorios" />
              <Select label="Ordem" name="ordem" defaultValue="" placeholder="Todas as Ordens" wrapperStyle={{ width: 240 }}
                options={Object.entries(ORDENS).map(([value, label]) => ({ value, label }))} />
              <Input label="De" name="de" type="date" defaultValue={periodo.de} required wrapperStyle={{ width: 160 }} />
              <Input label="Até" name="ate" type="date" defaultValue={periodo.ate} required wrapperStyle={{ width: 160 }} />
              <Button type="submit" variant="secondary" iconLeft="printer">Emitir extrato</Button>
            </form>
          </div>
        </Card>
      </Conteudo>
    </>
  );
}
