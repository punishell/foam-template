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

export const Bio = ({ body }: { body: string }): JSX.Element => {
    const [showBio, setShowBio] = useState(false);
    return (
        <div className="flex w-full grow flex-col border-b bg-white p-4 sm:w-[60%] sm:gap-3 sm:rounded-2xl sm:border sm:border-yellow-dark sm:bg-[#FFEFD7]">
            <Button
                className="!m-0 flex w-full items-center justify-between !p-0"
                onClick={() => {
                    setShowBio(!showBio);
                }}
            >
                <h3 className="text-left text-lg font-bold text-title sm:text-2xl sm:font-medium">
                    Bio
                </h3>
                <ChevronRight
                    className={`h-6 w-6 text-body transition-transform duration-300 sm:hidden ${showBio ? "rotate-90 transform" : ""}`}
                />
            </Button>
            <div
                className={`flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ${showBio ? "mt-4 h-fit" : "h-0"} sm:mt-0 sm:h-fit`}
            >
                {body}
            </div>
        </div>
    );
};
