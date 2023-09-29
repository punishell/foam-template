import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { UserBalance } from '@/components/common/user-balance';
import { ReferralSideModal } from './refer';
import { useUserState } from '@/lib/store/account';

export const Header = () => {
  const [referOpen, _setReferOpen] = useState(false);
  const { firstName } = useUserState();
  return (
    <div className="flex items-center justify-between">
      <ReferralSideModal isOpen={referOpen} onOpenChange={(e) => _setReferOpen(e)} />
      <div className="text-3xl text-title font-bold">Hello {firstName},</div>

      <div className="flex items-center gap-7">
        <div className="flex items-center gap-2 text-3xl text-title">
          <UserBalance />
          <span>|</span> <span className="text-body">Balance</span>
        </div>
        <button className="flex gap-2 rounded-lg items-center text-primary text-sm font-bold bg-[#ECFCE5] px-3 py-1 border border-primary" onClick={() => _setReferOpen(true)}>
          <UserPlus size={18} />
          <span>Refer</span>
        </button>
      </div>
    </div>
  );
};
