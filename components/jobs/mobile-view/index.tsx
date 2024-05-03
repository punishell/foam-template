"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCallback, useEffect, useState } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { OpenJobs } from "./home/open";
import { CreatedJobs } from "./home/created";
import { AcceptedJobs } from "./home/accepted";

interface TabTriggerProps {
    value: string;
    label: string;
}

function TabTrigger({ label, value }: TabTriggerProps): React.JSX.Element {
    return (
        <RadixTabs.Trigger
            value={value}
            className="flex items-center justify-center rounded-lg px-6 py-1 duration-200 hover:bg-white hover:text-black radix-state-active:bg-white radix-state-active:text-black"
        >
            {label}
        </RadixTabs.Trigger>
    );
}

export default function JobsMobileView(): React.JSX.Element {
    const router = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams);
            params.set(name, value);
            return params.toString();
        },
        [searchParams]
    );

    const urlTab = searchParams.get("jobs-type");
    const [activeTab, setActiveTab] = useState(urlTab ?? "open");

    const handleTabChange = (value: string): void => {
        setActiveTab(value);
        router.push(`${pathname}?${createQueryString("jobs-type", value)}`);
    };

    useEffect(() => {
        if (urlTab != null) {
            setActiveTab(urlTab);
        }
    }, [urlTab]);

    return (
        <RadixTabs.Root
            value={activeTab}
            defaultValue="open"
            onValueChange={handleTabChange}
            className="flex h-full w-full flex-col"
        >
            <div className="flex w-full items-center justify-center gap-4 bg-emerald-900 px-5 py-2">
                <RadixTabs.List className="grid w-full grid-cols-3 gap-1 rounded-lg bg-white bg-opacity-10 p-1 text-base text-white ">
                    <TabTrigger value="open" label="Open" />
                    <TabTrigger value="created" label="Created" />
                    <TabTrigger value="accepted" label="Accepted" />
                </RadixTabs.List>
            </div>

            <RadixTabs.Content value="open" className="h-full overflow-y-auto">
                <OpenJobs />
            </RadixTabs.Content>
            <RadixTabs.Content
                value="created"
                className="h-full overflow-y-auto"
            >
                <CreatedJobs />
            </RadixTabs.Content>
            <RadixTabs.Content
                value="accepted"
                className="h-full overflow-y-auto"
            >
                <AcceptedJobs />
            </RadixTabs.Content>
        </RadixTabs.Root>
    );
}
