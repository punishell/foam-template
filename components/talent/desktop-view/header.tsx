"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { NumericInput } from "@/components/common/numeric-input";

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
    return (
        <div className="hidden w-full items-end gap-4 rounded-2xl border border-[#7DDE86] bg-white p-6 sm:flex">
            <div className="relative flex grow flex-col gap-1">
                <label htmlFor="" className="text-sm">
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
            <div className="relative flex grow flex-col gap-1">
                <label htmlFor="" className="text-sm">
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
                <label htmlFor="" className="text-sm">
                    Afroscore
                </label>
                <div className="flex h-11 gap-2 rounded-lg border border-line bg-gray-50 py-2">
                    <NumericInput
                        type="text"
                        value={minimumPriceQuery}
                        placeholder="From"
                        onChange={(e) => {
                            setMinimumPriceQuery(e.target.value);
                        }}
                        className="grow bg-transparent px-3 placeholder:text-sm focus:outline-none"
                    />
                    <div className="border-r border-line" />
                    <NumericInput
                        type="text"
                        placeholder="To"
                        value={maximumPriceQuery}
                        onChange={(e) => {
                            setMaximumPriceQuery(e.target.value);
                        }}
                        className="grow bg-transparent px-3 placeholder:text-sm focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
};
