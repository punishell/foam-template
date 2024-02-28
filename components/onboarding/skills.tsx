"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import clsx from "clsx";
import { Button } from "pakt-ui";
import {
	type LucideIcon,
	PenTool,
	Terminal,
	Users,
	Feather,
	Library,
	Volume2,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUserState } from "@/lib/store/account";
import { type SlideItemProps } from "@/components/common";
import { useOnboardingState } from "@/lib/store/onboarding";

interface SkillCardProps {
	label: string;
	Icon: LucideIcon;
	isActive: boolean;
	toggleSelection: () => void;
}

function SkillCard({
	label,
	Icon,
	isActive,
	toggleSelection,
}: SkillCardProps): React.JSX.Element {
	return (
		<button
			onClick={toggleSelection}
			className={clsx(
				"flex sm:min-w-[200px] flex-col items-start gap-4 rounded-lg border p-4 sm:p-6 text-title duration-200 hover:bg-gray-100",
				{
					"border-[#E8E8E8] bg-[#FCFCFC]": !isActive,
					"border-[#007C5B] bg-[#007C5B1A]": isActive,
				},
			)}
			type="button"
		>
			<Icon size={32} />
			<span className="text-xl sm:text-2xl">{label}</span>
		</button>
	);
}

const SKILLS = [
	{ label: "Design", value: "design", Icon: PenTool },
	{ label: "Engineering", value: "engineering", Icon: Terminal },
	{ label: "Product", value: "product", Icon: Library },
	{ label: "Marketing", value: "marketing", Icon: Volume2 },
	{ label: "Copywriting", value: "copywriting", Icon: Feather },
	{ label: "Others", value: "others", Icon: Users },
];

export function Skills({ goToNextSlide }: SlideItemProps): React.JSX.Element {
	const { firstName } = useUserState();
	const { skill, setSkill } = useOnboardingState();
	return (
		<div className="flex w-full shrink-0 flex-col items-center sm:gap-4">
			<div className="flex w-full flex-col gap-1 text-left">
				<p className="text-lg text-white sm:text-black sm:text-2xl">
					Great to meet you, {firstName}.
				</p>
				<span className="text-2xl sm:text-4xl font-bold text-white sm:text-[#1f2739]">
					What are you interested in?
				</span>
			</div>
			<div className="mt-4 sm:mt-9 grid w-full grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 sm:p-0 p-4 bg-white sm:bg-transparent rounded-2xl shadow sm:rounded-none sm:shadow-none">
				{SKILLS.map(({ Icon, label, value }) => (
					<SkillCard
						key={value}
						label={label}
						Icon={Icon}
						isActive={skill === value}
						toggleSelection={() => {
							setSkill(value);
						}}
					/>
				))}
				<div className="mx-auto mt-2 w-full max-w-xs col-span-2 sm:hidden">
					<Button
						fullWidth
						disabled={skill === ""}
						onClick={goToNextSlide}
					>
						Continue
					</Button>
				</div>
			</div>
			<div className="mx-auto mt-2 w-full max-w-xs hidden sm:block">
				<Button
					fullWidth
					disabled={skill === ""}
					onClick={goToNextSlide}
				>
					Continue
				</Button>
			</div>
		</div>
	);
}
