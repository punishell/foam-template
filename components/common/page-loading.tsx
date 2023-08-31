import React from 'react';
import { cn } from '@/lib/utils';
import { RaceBy } from '@uiball/loaders';

interface Props {
  className?: string;
}

export const PageLoading: React.FC<Props> = ({ className }) => {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className={cn('flex h-screen w-full items-center justify-center bg-transparent bg-white', className)}
    >
      <RaceBy />
    </div>
  );
};
