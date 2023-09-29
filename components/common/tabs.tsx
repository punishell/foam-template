'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { createQueryString } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface Props {
  tabs: Tab[];
  urlKey?: string;
  defaultTab?: string;
  className?: string;
}

export const Tabs: React.FC<Props> = ({ tabs, defaultTab, urlKey, className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlTab = searchParams.get(urlKey || 'tab');
  const initialTab = urlTab || defaultTab || tabs[0].value;
  const [activeTab, setActiveTab] = React.useState(initialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // update the URL whenever the tab changes
    router.push(`${pathname}?${createQueryString(urlKey || 'tab', value)}`);
  };

  // update the state whenever the URL changes
  React.useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  return (
    <RadixTabs.Root
      value={activeTab}
      defaultValue={initialTab}
      onValueChange={handleTabChange}
      className={cn("flex flex-col gap-4relative justify-start items-start w-full", className)}
    >
      <RadixTabs.List className="flex items-center border-b">
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.value}
            value={tab.value}
            className="border-b-2 hover:text-primary border-transparent radix-state-active:border-primary text-title min-w-[100px] text-center py-2 px-8 text-sm font-medium transition-all duration-200"
          >
            {tab.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      <div className='overflow-y-auto scrollbar-hide grow mt-4 w-full'>
        {tabs.map((tab) => (
          <RadixTabs.Content
            key={tab.value}
            value={tab.value}
            className="w-full radix-state-active:flex radix-state-active:flex-col radix-state-active:h-full overflow-y-auto grow-0 justify-start"
          >
            {tab.content}
          </RadixTabs.Content>
        ))}
      </div>
    </RadixTabs.Root>
  );
};
