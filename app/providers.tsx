'use client';
import React from 'react';
import { axios } from '@/lib/axios';
import { RaceBy } from '@uiball/loaders';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { QueryCache, QueryClient, MutationCache, QueryClientProvider } from '@tanstack/react-query';

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  const router = useRouter();
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof Error) {
              console.error(`👀 Something went wrong 👀: ${error.message}`);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (error instanceof Error) {
              console.error(`👀 Something went wrong 👀: ${error.message}`);
            }
          },
        }),
      }),
  );

  const [tokenSet, setTokenSet] = React.useState(false);

  React.useEffect(() => {
    const token = getCookie('jwt');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return () => {
      axios.defaults.headers.common['Authorization'] = '';
    };
  }, [router]);

  if (!tokenSet) {
    return <Loader />;
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

const Loader = () => {
  return (
    <div aria-live="polite" aria-busy="true" className="flex h-screen w-screen items-center justify-center">
      <RaceBy />
    </div>
  );
};
