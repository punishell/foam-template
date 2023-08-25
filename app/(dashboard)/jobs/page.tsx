'use client';

import React from 'react';
import { Button } from 'pakt-ui';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import * as RadixTabs from '@radix-ui/react-tabs';

import { OpenJobs } from '@/components/jobs/open-jobs';
import { CreatedJobs } from '@/components/jobs/created-jobs';
import { AcceptedJobs } from '@/components/jobs/assigned-jobs';

export default function Jobs() {
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

  const urlTab = searchParams.get('jobs-type');
  const [activeTab, setActiveTab] = React.useState(urlTab || 'open');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`${pathname}?${createQueryString('jobs-type', value)}`);
  };

  React.useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <RadixTabs.Root
          value={activeTab}
          defaultValue="open"
          onValueChange={handleTabChange}
          className="flex flex-col gap-4 w-full"
        >
          <div className="flex items-center justify-between gap-4 w-full">
            <RadixTabs.List className="grid grid-cols-3 gap-1 rounded-lg bg-[#F0F2F5] p-0.5 text-base text-[#828A9B] w-fit">
              <TabTrigger value="open" label="Open" />
              <TabTrigger value="created" label="Created" />
              <TabTrigger value="accepted" label="Accepted" />
            </RadixTabs.List>

            <Button size="sm" onClick={() => router.push('/jobs/create')}>
              <div className="flex items-center gap-2">
                <Plus size={20} />
                <span>Create Job</span>
              </div>
            </Button>
          </div>

          <RadixTabs.Content value="open">
            <OpenJobs />
          </RadixTabs.Content>
          <RadixTabs.Content value="created">
            <CreatedJobs />
          </RadixTabs.Content>
          <RadixTabs.Content value="accepted">
            <AcceptedJobs />
          </RadixTabs.Content>
        </RadixTabs.Root>
      </div>
    </div>
  );
}

interface TabTriggerProps {
  value: string;
  label: string;
}

const TabTrigger: React.FC<TabTriggerProps> = ({ label, value }) => {
  return (
    <RadixTabs.Trigger
      value={value}
      className="rounded-lg flex py-1 px-6 justify-center items-center duration-200 hover:bg-white radix-state-active:bg-white"
    >
      {label}
    </RadixTabs.Trigger>
  );
};
