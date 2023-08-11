import React from 'react';
import { UserPlus } from 'lucide-react';
import { UserBalance } from '@/components/common/user-balance';

export const Header = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-3xl text-title font-bold">Hello Leslie</div>

      <div className="flex items-center gap-7">
        <div className="flex items-center gap-2 text-3xl text-title">
          <UserBalance />
          <span>|</span> <span className="text-body">Balance</span>
        </div>
        <button className="flex gap-2 rounded-lg items-center text-primary text-sm font-bold bg-[#ECFCE5] px-3 py-1 border border-primary">
          <UserPlus size={18} />
          <span>Refer</span>
        </button>
      </div>
    </div>
  );
};
