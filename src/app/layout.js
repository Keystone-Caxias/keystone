import { EB_Garamond, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import '@/ds/tokens/colors.css';
import '@/ds/tokens/typography.css';
import '@/ds/tokens/spacing.css';
import '@/ds/tokens/shape.css';
import '@/ds/tokens/motion.css';
import '@/ds/tokens/semantic.css';
import '@/ds/tokens/base.css';
import './globals.css';

const garamond = EB_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-garamond', display: 'swap' });
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-plex-sans', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });

export const metadata = {
  title: { default: 'Ordens Inglesas', template: '%s · Ordens Inglesas' },
  description: 'Plataforma interna de cadastro e registro do Arco Real, Mestre Maçom da Marca e Nautas da Arca Real.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${garamond.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
