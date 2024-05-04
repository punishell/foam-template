"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UserProfile } from "@/lib/types";
import { AfroProfile } from "@/components/common/afro-profile";

interface ApplicantCardProps {
    bid: number;
    message?: string;
    talent: UserProfile;
    inviteReceiverId?: string;
}

export const ApplicantCard: FC<ApplicantCardProps> = ({
    bid,
    talent,
    message,
    inviteReceiverId,
}) => {
    const router = useRouter();
    const { firstName, lastName, score, profileImage, profile } = talent;
    const hasBeenInvited = inviteReceiverId === talent._id;

    return (
        <div
            className="flex w-full flex-col gap-4 border-b border-green-300 bg-white p-4 pt-2"
            onClick={() => {
                router.push(`/talents/${talent._id}`);
            }}
            onKeyDown={() => {
                router.push(`/talents/${talent._id}`);
            }}
            role="button"
            tabIndex={0}
        >
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <AfroProfile
                        score={score}
                        size="2sm"
                        src={profileImage?.url}
                        className="relative -left-[10px]"
                    />
                    <div className="relative -left-[10px] flex flex-col items-start">
                        <span className="text-lg font-bold text-title">{`${firstName} ${lastName}`}</span>
                        <span className="text-xs leading-[18px] tracking-wide text-neutral-500">{`${firstName} ${lastName}`}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex rounded-full bg-[#B2E9AA66] px-3 text-base text-title">
                        Bid ${bid}
                    </span>
                    {hasBeenInvited && (
                        <span className="inline-flex rounded-full border border-green-400 bg-green-50 px-3 text-sm text-green-900">
                            Invited
                        </span>
                    )}
                </div>
            </div>
            <p className="grow text-base leading-normal tracking-tight text-gray-800">
                {message}
            </p>

            <div className="flex flex-wrap gap-2">
                {profile.talent.tagsIds &&
                    profile.talent.tagsIds.length > 0 &&
                    profile.talent.tagsIds.slice(0, 3).map((s) => (
                        <span
                            key={s.color + s.name}
                            style={{ background: s.color }}
                            className="grow whitespace-nowrap rounded-full bg-green-100 px-4 py-0.5 text-[#090A0A]"
                        >
                            {s.name}
                        </span>
                    ))}
            </div>
        </div>
    );
};
