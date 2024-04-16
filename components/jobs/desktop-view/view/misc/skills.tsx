"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { sentenceCase } from "@/lib/utils";

interface JobSkillsProps {
	skills: Array<{ name: string; color: string }>;
}

export const JobSkills = ({ skills }: JobSkillsProps): ReactElement => {
	return (
		<div className="flex w-full flex-col gap-2 rounded-2xl bg-white pb-4">
			<h3 className="text-lg font-bold text-title">Preferred Skills</h3>
			<div className="flex flex-wrap gap-2">
				{skills.map((skill, index) => (
					<span
						key={index}
						className="w-fit whitespace-nowrap rounded-full bg-[#F7F9FA] px-4 py-2 text-[#090A0A]"
						style={{ background: skill.color }}
					>
						{sentenceCase(skill.name)}
					</span>
				))}
			</div>
		</div>
	);
};
