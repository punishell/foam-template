'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React from 'react';
import { axios } from '@/lib/axios';
import { RaceBy } from '@uiball/loaders';
import { getCookie } from 'cookies-next';
import { AUTH_TOKEN_KEY } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
}

const Loader = () => {
  return (
    <div aria-live="polite" aria-busy="true" className="flex h-screen w-screen items-center justify-center">
      <RaceBy />
    </div>
  );
};

export default function OnboardingLayout({ children }: Props) {
  const router = useRouter();
  const token = getCookie(AUTH_TOKEN_KEY);
  const [isTokenSet, setIsTokenSet] = React.useState(false);

  React.useEffect(() => {
    if (token) {
      setIsTokenSet(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return () => {
      axios.defaults.headers.common['Authorization'] = '';
    };
  }, [router, token]);

  if (!isTokenSet) {
    return <Loader />;
  }

  return (
    <div className="h-screen w-screen">
      <div className="relative grow ">
        <div className="bg-auth-gradient fixed inset-0" />
        <div className="bg-[url(/images/cardboard.png)] fixed opacity-40 inset-0" />

        <div className="relative h-screen p-5 px-8 z-10 flex-col w-full isolate flex items-center justify-center">
          <div className="flex flex-col gap-4 max-w-4xl w-full">
            <div className="mx-auto">
              <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
            </div>
            <div className="bg-white rounded-2xl border p-8 w-full relative">
              <div className="absolute bg-repeat opacity-50 inset-0 bg-[url(/images/rain.png)]" />
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
