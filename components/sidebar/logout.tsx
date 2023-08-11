import { LogOut as LogoutIcon } from 'lucide-react';

export const LogOut = () => {
  return (
    <button className="flex min-w-[150px] items-center duration-200 gap-2 w-full hover:bg-[#0E936F] text-base rounded-lg px-3 py-2 font-normal text-white">
      <LogoutIcon size={20} />
      <span>Logout</span>
    </button>
  );
};
