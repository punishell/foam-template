import React from 'react';
import Image from 'next/image';
import { AfroProfile } from '@/components/common/afro-profile';

interface Props {
  score?: number;
}

export const AfroScore = ({ score = 0 }: Props) => {
  return (
    <div className="bg-white flex items-center justify-center p-4 pt-0 flex-col gap-1 w-[280px] border border-line rounded-2xl">
      <AfroProfile score={score} size="xl">
        <div className="relative w-[50%] h-[50%] translate-y-1/2 mx-auto">
          <Image src="/images/afrofund.png" alt="logo" layout="fill" />
        </div>
      </AfroProfile>
      <span className="text-2xl font-bold text-title">Afroscore</span>
    </div>
  );
};
