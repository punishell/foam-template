"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronRight } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

const MobileSubNav = ({
	closeSheet,
	from,
	to,
}: {
	closeSheet: Dispatch<SetStateAction<boolean>>;
	from: string;
	to: string;
}): JSX.Element => (
	<div className="sm:hidden w-full h-[43px] px-[35px] py-[11px] bg-neutral-50 border border-gray-200 flex-col justify-start items-start gap-2.5 inline-flex sticky top-0 left-0 z-50">
		<div className="justify-start items-start inline-flex">
			<div className="justify-start items-start flex">
				<div className="justify-center items-center gap-2 flex">
					<div
						className="text-gray-500 text-sm leading-[21px] tracking-wide"
						role="button"
						tabIndex={0}
						onClick={(e) => {
							e.stopPropagation();
							closeSheet(false);
						}}
						onKeyPress={() => {
							closeSheet(false);
						}}
					>
						{from}
					</div>
					<ChevronRight size={20} className="text-gray-500" />
					<div className="text-teal-700 text-sm font-bold font-['Circular Std'] leading-[21px] tracking-wide">
						{to}
					</div>
				</div>
			</div>
		</div>
	</div>
);

interface MobileSheetWrapperProps {
	children: React.ReactNode;
	closeSheet: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
	from: string;
	to: string;
}

const MobileSheetWrapper = ({ children, closeSheet, isOpen, from, to }: MobileSheetWrapperProps): JSX.Element => {
	return (
		<div
			className={`fixed top-16 z-50 w-full h-[calc(100vh-130px)] overflow-y-scroll bg-[#F1FBFF] transition-all duration-300 ease-in-out ${isOpen ? "right-0" : "-right-full"}`}
		>
			<MobileSubNav closeSheet={closeSheet} from={from} to={to} />
			<div className="relative h-full w-full">{children}</div>
		</div>
	);
};

export default MobileSheetWrapper;
