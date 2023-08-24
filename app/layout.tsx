import './styles.css';
import 'pakt-ui/styles.css';

import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import localFont from 'next/font/local';
import { MessagingProvider } from '@/providers/socketProvider';
export const metadata: Metadata = {
  title: 'Afrofund',
  description: '',
};

interface Props {
  children: React.ReactNode;
}

const circularStd = localFont({
  src: [
    {
      path: '../fonts/CircularStd-Book.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/CircularStd-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/CircularStd-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--circular-std-font',
});

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={`${circularStd.variable} overflow-x-hidden font-sans h-screen overflow-y-hidden`}>
        <MessagingProvider>
          <Providers>{children}</Providers>
        </MessagingProvider>
      </body>
    </html>
  );
}
