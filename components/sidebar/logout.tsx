'use client';

import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import { LogOut as LogoutIcon } from 'lucide-react';
import { AUTH_TOKEN_KEY } from '@/lib/utils';

export const LogOut = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        deleteCookie(AUTH_TOKEN_KEY);
        router.push('/login');
      }}
      className="flex min-w-[150px] items-center duration-200 gap-2 w-full hover:bg-[#0E936F] text-base rounded-lg px-3 py-2 font-normal text-white"
    >
      <LogoutIcon size={20} />
      <span>Logout</span>
    </button>
  );
};
