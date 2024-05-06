"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { ChevronRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { sentenceCase } from "@/lib/utils";
import { Button } from "@/components/common/button";

interface JobSkillsProps {
    skills: Array<{ name: string; color: string }>;
}

export const JobSkills = ({ skills }: JobSkillsProps): JSX.Element => {
    const [showSkill, setShowSkill] = useState(false);
    return (
        <div className="flex w-full flex-col border-b border-gray-200 bg-white px-5 py-4">
            <Button
                className="!m-0 flex w-full items-center justify-between !p-0"
                onClick={() => {
                    setShowSkill(!showSkill);
                }}
            >
                <h3 className="text-base font-bold leading-normal tracking-wide text-black">
                    Preferred Skills
                </h3>
                <ChevronRight
                    className={`h-6 w-6 text-body transition-transform duration-300 sm:hidden ${showSkill ? "rotate-90 transform" : ""}`}
                />
            </Button>
            <div
                className={`flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ${showSkill ? "mt-2 h-fit" : "h-0"} sm:mt-0 sm:h-fit`}
            >
                {skills.map((skill, index) => (
                    <span
                        key={index}
                        className="w-fit whitespace-nowrap rounded-full bg-[#F7F9FA] px-4 py-2 text-sm leading-[21px] tracking-wide text-neutral-950"
                        style={{ background: skill.color }}
                    >
                        {sentenceCase(skill.name)}
                    </span>
                ))}
            </div>
        </div>
    );
};
