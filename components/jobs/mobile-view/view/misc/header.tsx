"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import { Calendar, Tag } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AfroProfile } from "@/components/common/afro-profile";

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

export const JobHeader = ({
    title,
    price,
    dueDate,
    creator,
}: JobHeaderProps): JSX.Element => {
    // Handle due date error
    const dueDateError = new Date(dueDate).toString() === "Invalid Date";
    const dueDateValue = dueDateError ? new Date() : new Date(dueDate);
    return (
        <div className="flex flex-col items-start gap-2.5 bg-primary-gradient px-4 py-[18px]">
            <h2 className="text-lg font-bold leading-[27px] tracking-wide text-neutral-50">
                {title}
            </h2>

            <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 rounded-lg bg-[#ECFCE5] px-3 py-1 text-[#198155]">
                    <Tag size={20} />
                    <span>$ {price}</span>
                </span>

                <span className="flex items-center gap-2 rounded-lg bg-[#C9F0FF] px-3 py-1 text-[#0065D0]">
                    <Calendar size={20} />
                    <span>Due {format(dueDateValue, "MMM dd, yyyy")}</span>
                </span>
            </div>

            {creator?._id && (
                <div className="flex items-center gap-0 text-center">
                    <AfroProfile
                        src={creator.avatar}
                        size="sm"
                        score={creator.score}
                        url={`/talents/${creator._id}`}
                    />
                    <span className="text-base font-bold leading-normal tracking-wide text-white">
                        {creator.name}
                    </span>
                </div>
            )}
        </div>
    );
};
