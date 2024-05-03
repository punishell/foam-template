"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { ChevronRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";

interface DeliverablesProps {
    deliverables: string[];
}

export const JobDeliverables = ({
    deliverables,
}: DeliverablesProps): JSX.Element => {
    const [showDeliverables, setShowDeliverables] = useState(false);
    return (
        <div className="flex w-full flex-col bg-slate-50 px-5 py-4">
            <Button
                className="!m-0 flex w-full items-center justify-between !p-0"
                onClick={() => {
                    setShowDeliverables(!showDeliverables);
                }}
            >
                <h3 className="text-base font-bold leading-normal tracking-wide text-black">
                    Deliverables
                </h3>
                <ChevronRight
                    className={`h-6 w-6 text-body transition-transform duration-300 sm:hidden ${showDeliverables ? "rotate-90 transform" : ""}`}
                />
            </Button>
            <div
                className={`flex h-full flex-col gap-4 !overflow-hidden transition-all duration-300 ${showDeliverables ? "mt-2 h-fit" : "!h-0"} sm:mt-0 sm:h-fit`}
            >
                {deliverables.map((deliverable, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-2 border-b border-gray-200 py-4"
                    >
                        <span className="text-base leading-normal tracking-wide text-neutral-950">
                            {index + 1}.
                        </span>
                        <p
                            key={index}
                            className="text-base leading-normal tracking-wide text-neutral-950"
                        >
                            {deliverable}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
