import { Conteudo } from '@/components/Conteudo';
import { LinkButton } from '@/components/LinkButton';
import { Topbar } from '@/components/Topbar';
import { LojaForm } from '../LojaForm';

export const metadata = { title: 'Nova loja' };

export default function NovaLojaPage() {
  return (
    <>
      <Topbar eyebrow="Lojas simbólicas" title="Nova loja"
        actions={<LinkButton href="/lojas" size="sm" variant="secondary">Voltar</LinkButton>} />
      <Conteudo>
        <LojaForm loja={null} />
      </Conteudo>
    </>
  );
}
