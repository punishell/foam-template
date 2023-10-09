import React from 'react';
import Image from 'next/image';
import { AfroScore as AfroScorePrimitive } from '@/components/common/afro-profile';

interface Props {
  score?: number;
}

export const AfroScore = ({ score = 0 }: Props) => {
  return (
    <div className="bg-white flex items-center justify-center flex-col w-full border border-line rounded-2xl">
      {/* {score > 0 ? <NonZeroAfroScore score={score} /> : <ZeroAfroScore />} */}
      <ZeroAfroScore />
    </div>
  );
};

const ZeroAfroScore = () => {
  return (
    <div className="pt-4 px-6 flex flex-col gap-6">
      <div className="flex flex-col items-center text-center gap-2">
        <span className="text-2xl font-bold text-title">Afroscore</span>
        <span className="text-body text-sm max-w-[90%]">Complete your first job to get your Afro Score</span>
      </div>

      <div className="mx-auto mt-auto flex w-[80%] items-center justify-center rounded-t-[60px] bg-[#6FCF97] bg-opacity-10 p-10 py-5">
        <div className="h-[90px] w-[90px]">
          <Image src="/images/afrofund.png" alt="" width={100} height={100} />
        </div>
      </div>
    </div>
  );
};

const NonZeroAfroScore: React.FC<Props> = ({ score = 0 }) => {
  return (
    <div className="flex flex-col gap-1 items-center p-4 pt-0">
      <AfroScorePrimitive score={score} size="xl">
        <div className="relative w-[50%] h-[50%] translate-y-1/2 mx-auto">
          <Image src="/images/afrofund.png" alt="logo" layout="fill" />
        </div>
      </AfroScorePrimitive>
      <span className="text-2xl font-bold text-title">Afroscore</span>
    </div>
  );
};
