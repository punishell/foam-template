"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { Plus, Search } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "../common/button";

const JobAction = (): JSX.Element => {
	const [showButtons, setShowButtons] = useState(false);

	const toggleButtons = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.stopPropagation();
		setShowButtons(!showButtons);
	};

	return (
		<div className="fixed bottom-[15%] right-[10%] sm:hidden z-30">
			<div className="relative">
				<div
					className={`flex space-y-2 flex-col transition-all duration-300 absolute right-0 top-0 origin-bottom-right ${showButtons ? "opacity-100 -translate-y-[120%] z-10" : "opacity-0 -translate-y-[0] z-1"} `}
				>
					<Button className="gap-2.5 flex items-center" variant="primary" size="lg">
						<Plus size={20} /> Create Job
					</Button>
					<Button className="gap-2.5 flex items-center" variant="secondary" size="lg">
						<Search size={20} /> Find Job
					</Button>
				</div>
				<div className="relative">
					<Button
						className="bg-primary text-white py-2 px-4 rounded-full z-20 shadow w-[68px] h-[68px] relative cursor-pointer"
						onClick={toggleButtons}
						type="button"
					>
						<Plus
							size={37}
							className={`transform transition-all duration-300 ${showButtons ? "rotate-45" : ""}`}
						/>
					</Button>
					<div className="cancel-drag" />
				</div>
			</div>
		</div>
	);
};

export default JobAction;
