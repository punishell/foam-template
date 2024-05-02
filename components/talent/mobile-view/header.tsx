"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { Search, X } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { NumericInput } from "@/components/common/numeric-input";
import { Button } from "../../common/button";

export const TalentHeader = ({
    searchQuery,
    setSearchQuery,
    skillsQuery,
    setSkillsQuery,
    minimumPriceQuery,
    setMinimumPriceQuery,
    maximumPriceQuery,
    setMaximumPriceQuery,
}: {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    skillsQuery: string;
    setSkillsQuery: (value: string) => void;
    minimumPriceQuery: string | number;
    setMinimumPriceQuery: (value: string) => void;
    maximumPriceQuery: string | number;
    setMaximumPriceQuery: (value: string | number) => void;
}): JSX.Element => {
    const [showSearch, setShowSearch] = useState(false);

    return (
        <div className="sticky left-0 top-0 z-20 inline-flex h-auto w-full flex-col items-center justify-center border-t border-white border-opacity-10 bg-emerald-900 px-[21px] py-[11px]">
            <div className="relative z-10 inline-flex h-[53px] w-full items-center justify-between py-[11px]">
                <h3 className="text-2xl font-bold leading-[31.20px] tracking-wide text-neutral-50">
                    Talents
                </h3>
                <Button
                    className="!m-0 flex items-center justify-center !p-0"
                    onClick={() => {
                        setShowSearch(!showSearch);
                    }}
                >
                    {showSearch ? (
                        <X className="h-6 w-6 text-white transition-transform duration-300" />
                    ) : (
                        <Search className="h-6 w-6 text-white transition-transform duration-300" />
                    )}
                </Button>
            </div>
            <div
                className={`flex w-full flex-col items-end gap-4 overflow-hidden bg-emerald-900 transition-all duration-300 ${showSearch ? "py-4" : "h-0 py-0"}`}
            >
                <div className="relative flex w-full grow flex-col gap-1">
                    <label htmlFor="" className="text-sm text-white">
                        Search
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        placeholder="Name, Category, etc."
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                        }}
                        className="h-11 rounded-lg border border-line bg-gray-50 px-3 focus:outline-none"
                    />
                </div>
                <div className="relative flex w-full flex-col gap-1">
                    <label htmlFor="" className="text-sm text-white">
                        Skill
                    </label>
                    <input
                        type="text"
                        value={skillsQuery}
                        placeholder="Java, Solidity, etc."
                        onChange={(e) => {
                            setSkillsQuery(e.target.value);
                        }}
                        className="h-11 rounded-lg border border-line bg-gray-50 px-3 focus:outline-none"
                    />
                </div>
                <div className="relative flex grow flex-col gap-1">
                    <label htmlFor="" className="text-sm text-white">
                        Afroscore
                    </label>
                    <div className="flex h-11 w-full gap-2 rounded-lg border border-line bg-gray-50 py-2">
                        <NumericInput
                            type="text"
                            value={minimumPriceQuery}
                            placeholder="From"
                            onChange={(e) => {
                                setMinimumPriceQuery(e.target.value);
                            }}
                            className="!w-full bg-transparent px-3 placeholder:text-sm focus:outline-none"
                        />
                        <div className="border-r border-line" />
                        <NumericInput
                            type="text"
                            placeholder="To"
                            value={maximumPriceQuery}
                            onChange={(e) => {
                                setMaximumPriceQuery(e.target.value);
                            }}
                            className="!w-full bg-transparent px-3 placeholder:text-sm focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
