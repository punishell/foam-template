'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import * as RadixTabs from '@radix-ui/react-tabs';

interface Tab {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface Props {
  tabs: Tab[];
  defaultTab?: string;
}

export const Tabs: React.FC<Props> = ({ tabs, defaultTab }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams as any);
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const urlTab = searchParams.get('tab');
  const initialTab = urlTab || defaultTab || tabs[0].value;
  const [activeTab, setActiveTab] = React.useState(initialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // update the URL whenever the tab changes
    router.push(`${pathname}?${createQueryString('tab', value)}`);
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
      className="flex flex-col gap-4"
    >
      <RadixTabs.List className="flex items-center gap-4">
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.value}
            value={tab.value}
            className="border radix-state-active:hover:text-title border-transparent radix-state-active:border-primary radix-state-active:bg-[#0A1F441A] text-title rounded-xl min-w-[100px] text-center py-2 px-4 text-sm font-medium hover:bg-primary hover:text-white transition-all duration-200"
          >
            {tab.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {tabs.map((tab) => (
        <RadixTabs.Content key={tab.value} value={tab.value}>
          {tab.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
};
