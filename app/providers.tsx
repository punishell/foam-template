'use client';
import React from 'react';
import { axios } from '@/lib/axios';
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

  React.useEffect(() => {
    const token = getCookie('jwt');

    console.log('token', token);

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          router.push('/login');
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.defaults.headers.common['Authorization'] = '';
    };
  }, [router]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
