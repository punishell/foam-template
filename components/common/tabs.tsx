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
  urlKey?: string;
  defaultTab?: string;
}

export const Tabs: React.FC<Props> = ({ tabs, defaultTab, urlKey }) => {
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
      className="flex flex-col gap-4"
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

      {tabs.map((tab) => (
        <RadixTabs.Content key={tab.value} value={tab.value}>
          {tab.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
};
