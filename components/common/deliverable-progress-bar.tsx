/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";

interface Props {
	className?: string;
	isCancelled?: boolean;
	totalDeliverables: number;
	percentageProgress: number;
}

const InProgress: FC<BarProps> = ({ isCancelled }) => (
	<div
		className="h-2 flex-1 basis-0 rounded-full"
		style={{
			backgroundColor: isCancelled ? "#fee2e2" : "#e8e8e8",
		}}
	/>
);

interface BarProps {
	isCancelled?: boolean;
}

const Completed: FC<BarProps> = ({ isCancelled }) => (
	<div
		className="h-2 flex-1 basis-0 rounded-full"
		style={{
			backgroundColor: isCancelled ? "#FF5247" : "#23C16B",
		}}
	/>
);

export const DeliverableProgressBar: FC<Props> = ({
	percentageProgress,
	totalDeliverables,
	isCancelled,
	className,
}) => {
	const progressBars = [];

	for (let i = 0; i < totalDeliverables; i++) {
		if (i < percentageProgress / (100 / totalDeliverables)) {
			progressBars.push(<Completed key={i} isCancelled={isCancelled} />);
		} else {
			progressBars.push(<InProgress key={i} isCancelled={isCancelled} />);
		}
	}

	return (
		<div className={cn("flex w-full max-w-[200px] flex-col gap-2 text-xs", className)}>
			{isCancelled ? (
				<div className="flex items-center gap-1 text-[#FF5247]">
					<span>Job Cancelled. Progress:</span>
					<span>{percentageProgress}%</span>
				</div>
			) : (
				<div className="flex items-center gap-1 text-[#6E7191]">
					<span>Job Progress:</span>
					<span>{percentageProgress}%</span>
				</div>
			)}
			<div className="flex grow items-center gap-1">{progressBars}</div>
		</div>
	);
};
