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

interface JobDescriptionProps {
    description: string;
}

export const JobDescription = ({
    description,
}: JobDescriptionProps): JSX.Element => {
    const [showDescription, setShowDescription] = useState(true);
    return (
        <div className="flex w-full flex-col bg-blue-50 px-5 py-4 ">
            <Button
                className="!m-0 flex w-full items-center justify-between !p-0"
                onClick={() => {
                    setShowDescription(!showDescription);
                }}
            >
                <h3 className="text-base font-bold leading-normal tracking-wide text-black">
                    Job Description
                </h3>
                <ChevronRight
                    className={`h-6 w-6 text-body transition-transform duration-300 sm:hidden ${showDescription ? "rotate-90 transform" : ""}`}
                />
            </Button>

            <p
                className={`overflow-hidden text-base leading-normal tracking-wide text-zinc-700 transition-all duration-300 ${showDescription ? "mt-2 h-fit" : "h-0"} sm:mt-0 sm:h-fit`}
            >
                {description}
            </p>
        </div>
    );
};
