"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { type FC, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import * as RadixTabs from "@radix-ui/react-tabs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { createQueryString, cn } from "@/lib/utils";

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
    tabListClassName?: string;
    tabTriggerClassName?: string;
    customExtraComponent?: React.ReactNode;
    customExtraItem?: React.ReactNode;
}

export const Tabs: FC<Props> = ({
    tabs,
    defaultTab,
    urlKey,
    className,
    tabListClassName,
    tabTriggerClassName,
    customExtraComponent,
    customExtraItem,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const urlTab = searchParams.get(urlKey ?? "tab");
    const initialTab = urlTab ?? defaultTab ?? tabs[0]?.value;
    const [activeTab, setActiveTab] = React.useState(initialTab);

    const handleTabChange = (value: string): void => {
        setActiveTab(value);
        // update the URL whenever the tab changes
        router.push(`${pathname}?${createQueryString(urlKey ?? "tab", value)}`);
    };

    // update the state whenever the URL changes
    useEffect(() => {
        if (urlTab) {
            setActiveTab(urlTab);
        }
    }, [urlTab]);

    return (
        <RadixTabs.Root
            value={activeTab}
            defaultValue={initialTab}
            onValueChange={handleTabChange}
            className={cn(
                "relative flex w-full flex-col items-start justify-start sm:gap-4 max-sm:border-t max-sm:border-gray-200 max-sm:bg-white",
                className
            )}
        >
            <RadixTabs.List
                className={cn(
                    "flex w-full items-center border-b max-sm:h-[64px] max-sm:justify-between",
                    tabListClassName
                )}
            >
                {tabs.map((tab) => (
                    <RadixTabs.Trigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                            "border-b-2 border-transparent p-4 text-center text-sm font-medium text-gray-500 transition-all duration-200 hover:text-primary radix-state-active:border-primary radix-state-active:text-title sm:min-w-[100px] sm:px-8 sm:py-2",
                            tabTriggerClassName
                        )}
                    >
                        {tab.label}
                    </RadixTabs.Trigger>
                ))}
                {customExtraItem}
            </RadixTabs.List>
            {customExtraComponent}
            <div className="scrollbar-hide h-auto w-full grow overflow-y-auto sm:mt-2">
                {tabs.map((tab) => (
                    <RadixTabs.Content
                        key={tab.value}
                        value={tab.value}
                        className="w-full grow-0 justify-start overflow-y-auto radix-state-active:flex radix-state-active:h-full radix-state-active:flex-col"
                    >
                        {tab.content}
                    </RadixTabs.Content>
                ))}
            </div>
        </RadixTabs.Root>
    );
};
