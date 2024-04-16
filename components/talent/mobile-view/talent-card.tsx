"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { colorFromScore, limitString, titleCase } from "@/lib/utils";
import { AfroProfile } from "@/components/common/afro-profile";

interface TalentBoxProps {
    id: string;
    name: string;
    title: string;
    imageUrl?: string;
    score?: string;
    skills: Array<{ name: string; color: string }>;
}

export const TalentCard = ({
    id,
    name,
    title,
    imageUrl,
    score,
    skills,
}: TalentBoxProps): JSX.Element => {
    const colorCodes = colorFromScore(parseInt(score ?? "0", 10));

    return (
        <Link
            key={id}
            className="m-0 h-[125.50px] w-full p-0"
            style={{
                background: colorCodes.bgColor,
                borderBottom: `1px solid ${colorCodes.borderColor}`,
            }}
            href={`/talents/${id}`}
        >
            <div className="inline-flex w-full items-start justify-start px-[21px] py-4">
                <AfroProfile
                    size="2sm"
                    score={Math.round(Number(score))}
                    src={imageUrl}
                    url={`/talents/${id}`}
                    className="relative -left-[10px]"
                />
                <div className="inline-flex w-full flex-col items-start justify-start gap-4">
                    <div className="flex flex-col items-start justify-start gap-[2.58px]">
                        <h4 className="self-stretch text-lg font-bold leading-[27px] tracking-wide text-black">
                            {name}
                        </h4>
                        <p className="text-base leading-normal tracking-tight text-black">
                            {titleCase(title)}
                        </p>
                    </div>
                    <div className="flex items-center justify-start gap-1">
                        {skills?.length > 0 && (
                            <div className="flex w-full items-center gap-2">
                                {skills?.slice(0, 3).map(
                                    (
                                        skill: {
                                            name: string;
                                            color: string;
                                        },
                                        i: number
                                    ) => {
                                        const { color, name: n } = skill;
                                        const s = n || skill;
                                        return (
                                            <span
                                                key={i}
                                                className="shrink-0 grow items-center gap-2 rounded-3xl px-3 py-1 text-center text-xs capitalize"
                                                style={{
                                                    backgroundColor:
                                                        color ?? "#B2AAE9",
                                                }}
                                            >
                                                {limitString(s as string)}
                                            </span>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};
