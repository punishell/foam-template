import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<Props> = ({ children, className }) => {
  return <div className={`${cn('container w-full px-4 mx-auto', className)}`}>{children}</div>;
};
