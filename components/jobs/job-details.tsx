import Image from "next/image";
import { format } from "date-fns";
import { Calendar, Tag } from "lucide-react";
import { AfroScore, AfroProfile } from "@/components/common/afro-profile";
import { DefaultAvatar } from "@/components/common/default-avatar";
interface JobHeaderProps {
    title: string;
    price: number;
    dueDate: string;
    creator?: {
        _id: string;
        name: string;
        score: number;
        avatar?: string;
    };
}

export const JobHeader: React.FC<JobHeaderProps> = ({ title, price, dueDate, creator }) => {
    return (
        <div className="flex items-center justify-between gap-4 rounded-t-xl bg-primary-gradient p-4">
            <div className="flex h-full w-full max-w-2xl flex-col gap-6">
                <div className="grow pt-3">
                    <h2 className="text-3xl font-medium text-white">{title}</h2>
                </div>
                <div className="mt-auto flex items-center gap-4">
                    <span className="flex items-center gap-2 rounded-full bg-[#ECFCE5] px-3 py-1 text-[#198155]">
                        <Tag size={20} />
                        <span>$ {price}</span>
                    </span>

                    <span className="flex items-center gap-2 rounded-full bg-[#C9F0FF] px-3 py-1 text-[#0065D0]">
                        <Calendar size={20} />
                        <span>Due {format(new Date(dueDate), "MMM dd, yyyy")}</span>
                    </span>
                </div>
            </div>
            {creator && creator._id && (
                <div className="flex flex-col items-center gap-0 text-center">
                    <AfroProfile
                        src={creator.avatar}
                        size="2md"
                        score={creator.score}
                        url={`/talents/${creator._id}`}
                    />
                    <span className="whitespace-nowrap text-xl font-bold text-white">{creator.name}</span>
                </div>
            )}
        </div>
    );
};

interface JobDescriptionProps {
    description: string;
}

export const JobDescription: React.FC<JobDescriptionProps> = ({ description }) => {
    return (
        <div className="flex w-full flex-col gap-2">
            <h3 className="text-lg font-bold text-title">Job Description</h3>
            <p className="rounded-2xl border border-blue-200 bg-[#C9F0FF] p-4 text-lg font-normal text-[#202325]">
                {description}
            </p>
        </div>
    );
};

interface JobSkillsProps {
    skills: { name: string; color: string }[];
}

export const JobSkills: React.FC<JobSkillsProps> = ({ skills }) => {
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
                        {skill.name}
                    </span>
                ))}
            </div>
        </div>
    );
};

interface DeliverablesProps {
    deliverables: string[];
}

export const JobDeliverables: React.FC<DeliverablesProps> = ({ deliverables }) => {
    return (
        <div className="flex h-full w-full flex-col gap-2 rounded-2xl bg-white py-4">
            <h3 className="text-lg font-bold text-title">Deliverables</h3>

            <div className="flex h-full flex-col gap-4 overflow-y-auto">
                {deliverables.map((deliverable, index) => (
                    <div key={index} className="rounded-md bg-[#F7F9FA] p-4 text-[#090A0A]">
                        {deliverable}
                    </div>
                ))}
            </div>
        </div>
    );
};
