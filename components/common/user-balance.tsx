'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const UserBalance: React.FC<Props> = ({ className }) => {
  return <span className={cn('text-body text-3xl', className)}>$0.00</span>;
};
