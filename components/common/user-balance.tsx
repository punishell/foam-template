'use client';

import React from 'react';
import { cn, formatUsd } from '@/lib/utils';
import { useWalletState } from '@/lib/store/wallet';

interface Props {
  className?: string;
}

export const UserBalance: React.FC<Props> = ({ className }) => {
  const {totalWalletBalance} = useWalletState();
  return <span className={cn('text-body text-3xl', className)}>{formatUsd(parseFloat(totalWalletBalance))}</span>;
};
