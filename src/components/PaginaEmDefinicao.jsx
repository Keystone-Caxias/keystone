import { Placeholder } from './Placeholder';
import { Topbar } from './Topbar';

export function PaginaEmDefinicao({ titulo }) {
  return (
    <>
      <Topbar eyebrow="Em definição" title={titulo} />
      <Placeholder />
    </>
  );
}
