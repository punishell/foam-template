import React from 'react';
import { Loader } from 'lucide-react';

interface SpinnerProps {
  size?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 24 }) => {
  return (
    <div className="flex w-full items-center justify-center">
      <Loader className="animate-spin" size={size} />
    </div>
  );
};
