import React from 'react';
import { cn } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';

interface Props {
  isOpen: boolean;
  className?: string;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
}

export const SideModal: React.FC<Props> = ({ children, isOpen, onOpenChange, className }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            'bg-white max-w-[500px] w-full flex flex-col overflow-y-auto fixed z-50 right-0 top-0 bottom-0 data-[state=open]:slide-in-from-right-1/2 data-[state=closed]:slide-out-to-right-1/2 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            className,
          )}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
