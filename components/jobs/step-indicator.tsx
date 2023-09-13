
import { cn } from '@/lib/utils';
import { Checkbox, Button } from 'pakt-ui';

interface StepIndicatorProps {
  isComplete?: boolean;
  children: React.ReactNode;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ children, isComplete }) => {
  return (
    <label
      className={cn(
        'flex items-center gap-4 border rounded-lg py-3 px-3  duration-200 cursor-pointer border-gray-300 bg-gray-50 border-opacity-50 hover:bg-primary hover:bg-opacity-10',
        {
          'border-primary border-opacity-40 bg-green-300 bg-opacity-10 hover:bg-opacity-20 duration-200': isComplete,
        },
      )}
    >
      <Checkbox checked={isComplete} />
      <span>{children}</span>
    </label>
  );
};
