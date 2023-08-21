'use client';
import React from 'react';
import { QueryCache, QueryClient, MutationCache, QueryClientProvider } from '@tanstack/react-query';

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
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

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
