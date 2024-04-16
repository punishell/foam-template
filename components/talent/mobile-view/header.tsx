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
		<div className="w-full flex-col px-[21px] h-auto py-[11px] bg-emerald-900 border-t border-white border-opacity-10 justify-center items-center inline-flex sticky left-0 top-0 z-20">
			<div className="w-full h-[53px] py-[11px] justify-between items-center inline-flex z-10 relative">
				<h3 className="text-neutral-50 text-2xl font-bold leading-[31.20px] tracking-wide">Talents</h3>
				<Button
					className="!p-0 !m-0 flex items-center justify-center"
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
				className={`flex w-full flex-col items-end gap-4 bg-emerald-900 overflow-hidden transition-all duration-300 ${showSearch ? "py-4" : "h-0 py-0"}`}
			>
				<div className="relative flex grow flex-col gap-1 w-full">
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
				<div className="relative flex flex-col gap-1 w-full">
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
					<div className="flex h-11 gap-2 w-full rounded-lg border border-line bg-gray-50 py-2">
						<NumericInput
							type="text"
							value={minimumPriceQuery}
							placeholder="From"
							onChange={(e) => {
								setMinimumPriceQuery(e.target.value);
							}}
							className="bg-transparent px-3 placeholder:text-sm focus:outline-none !w-full"
						/>
						<div className="border-r border-line" />
						<NumericInput
							type="text"
							placeholder="To"
							value={maximumPriceQuery}
							onChange={(e) => {
								setMaximumPriceQuery(e.target.value);
							}}
							className="bg-transparent px-3 placeholder:text-sm focus:outline-none !w-full"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
