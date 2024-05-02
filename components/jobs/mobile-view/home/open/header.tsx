/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronDown } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { NumericInput } from "@/components/common/numeric-input";
import { Button } from "@/components/common/button";

interface OpenHeaderProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    skillsQuery: string;
    setSkillsQuery: (value: string) => void;
    minimumPriceQuery: string;
    setMinimumPriceQuery: (value: string) => void;
    maximumPriceQuery: string | number;
    setMaximumPriceQuery: (value: string | number) => void;
    viewAll: boolean;
    setViewAll: (value: boolean) => void;
}

export const OpenHeader = ({
    searchQuery,
    setSearchQuery,
    skillsQuery,
    setSkillsQuery,
    minimumPriceQuery,
    setMinimumPriceQuery,
    maximumPriceQuery,
    setMaximumPriceQuery,
    viewAll,
    setViewAll,
}: OpenHeaderProps): JSX.Element => {
    return (
        <div
            className={`transition-height flex w-full flex-col gap-4 overflow-hidden duration-300 ${viewAll ? "h-auto" : "h-[80px]"}`}
        >
            <div className="relative flex grow flex-col gap-1">
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
            <Button
                className={`!m-0 items-center justify-center gap-4 !p-0 text-base leading-normal tracking-tight text-white !text-opacity-50 ${viewAll ? "hidden" : "flex"}`}
                onClick={() => {
                    setViewAll(!viewAll);
                }}
            >
                View all
                <ChevronDown className="h-[18px] w-[18px] transition-transform duration-300" />
            </Button>
            <div className="relative flex grow flex-col gap-1">
                <input
                    type="text"
                    value={skillsQuery}
                    placeholder="Skills: e.g Java, Solidity, etc."
                    onChange={(e) => {
                        setSkillsQuery(e.target.value);
                    }}
                    className="h-11 rounded-lg border border-line bg-gray-50 px-3 focus:outline-none"
                />
            </div>
            <div className="relative flex grow flex-col gap-1">
                <div className="flex h-11 gap-2 rounded-lg border border-line bg-gray-50 py-2">
                    <NumericInput
                        type="text"
                        value={minimumPriceQuery}
                        placeholder="Price (min)"
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
