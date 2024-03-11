"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";
import { ChevronRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";

interface BreadcrumbItem {
	label: string;
	action?: () => void;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ items }) => {
	const [activeIndex, setActiveIndex] = useState<number>(0);

	const handleItemClick = (index: number): void => {
		setActiveIndex(index);
		if (items[index]?.action) {
			items[index]?.action?.();
		}
	};
	return (
		<div className="sm:hidden w-full h-[43px] px-[35px] py-[11px] bg-neutral-50 border border-gray-200 flex-col justify-start items-start gap-2.5 inline-flex sticky -top-[1px] left-0 z-50">
			<div className="justify-start items-start inline-flex">
				<div className="justify-start items-start flex">
					<div className="justify-center items-center gap-2 flex">
						{items?.map((item, index) => (
							<div key={index} className="flex items-center">
								{index !== 0 && <ChevronRight size={20} className="text-gray-500" />}
								<Button
									className={`cursor-pointer text-sm leading-[21px] tracking-wide ${index === activeIndex ? "font-semibold text-primary" : "text-gray-500"}`}
									onClick={(e) => {
										e.stopPropagation();
										handleItemClick(index);
									}}
								>
									{item.label}
								</Button>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

interface MobileSheetWrapperProps {
	children: React.ReactNode;
	isOpen: boolean;
}

const MobileSheetWrapper = ({ children, isOpen }: MobileSheetWrapperProps): JSX.Element => {
	return (
		<div
			className={`fixed top-16 z-50 w-full h-[calc(100vh-129px)] overflow-y-scroll bg-white transition-all duration-300 ease-in-out ${isOpen ? "right-0" : "-right-full"}`}
		>
			<div className="relative h-[calc(100%-43px)] w-full">{children}</div>
		</div>
	);
};

export default MobileSheetWrapper;
