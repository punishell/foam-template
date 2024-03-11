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
		<div className="flex w-full sm:w-[60%] grow flex-col sm:gap-3 sm:rounded-2xl bg-white border-b sm:border sm:border-yellow-dark sm:bg-[#FFEFD7] p-4">
			<Button
				className="!p-0 !m-0 flex items-center justify-between w-full"
				onClick={() => {
					setShowBio(!showBio);
				}}
			>
				<h3 className="text-left font-bold sm:text-2xl text-lg sm:font-medium text-title">Bio</h3>
				<ChevronRight
					className={`h-6 w-6 sm:hidden text-body transition-transform duration-300 ${showBio ? "transform rotate-90" : ""}`}
				/>
			</Button>
			<div
				className={`flex transition-all duration-300 flex-wrap overflow-hidden gap-2 ${showBio ? "h-fit mt-4" : "h-0"} sm:h-fit sm:mt-0`}
			>
				{body}
			</div>
		</div>
	);
};
