"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { ChevronRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AchievementBar } from "./bar";
import { type AchievementType, type AchievementProps } from "./types";
import { Button } from "@/components/common/button";

export const Achievements = ({
    achievements = [],
}: AchievementProps): JSX.Element => {
    const [showAchievements, setShowAchievements] = useState(false);

    achievements.sort((a, b) => b.total - a.total);
    return (
        <div className="shrink-0 border-b bg-white p-[4px] sm:rounded-2xl sm:border-2 sm:border-primary sm:bg-transparent">
            <div className="flex h-full w-full shrink-0 flex-col items-start px-4 py-4 sm:w-fit sm:items-center sm:gap-4 sm:rounded-xl sm:px-6">
                <Button
                    className="!m-0 flex w-full items-center justify-between !p-0"
                    onClick={() => {
                        setShowAchievements(!showAchievements);
                    }}
                >
                    <h3 className="text-center text-lg font-medium text-title sm:text-2xl">
                        Achievements
                    </h3>
                    <ChevronRight
                        className={`h-6 w-6 text-body transition-transform duration-300 sm:hidden ${showAchievements ? "rotate-90 transform" : ""}`}
                    />
                </Button>
                <div
                    className={`grid w-full grid-cols-4 gap-2 overflow-hidden transition-all duration-300  ${showAchievements ? " mt-4 h-fit" : "h-0"} sm:mt-0 sm:h-fit`}
                >
                    {achievements.length > 0 &&
                        achievements.map(({ total, type, value }) => {
                            return (
                                <AchievementBar
                                    key={type}
                                    achievement={{
                                        minValue: 0,
                                        value: Math.floor(value),
                                        maxValue: total,
                                        type: type as AchievementType,
                                    }}
                                />
                            );
                        })}
                    {achievements.length === 0 && (
                        <>
                            <AchievementBar
                                achievement={{
                                    type: "review",
                                    maxValue: 60,
                                    minValue: 0,
                                    value: 0,
                                }}
                            />
                            <AchievementBar
                                achievement={{
                                    type: "referral",
                                    maxValue: 20,
                                    minValue: 0,
                                    value: 0,
                                }}
                            />
                            <AchievementBar
                                achievement={{
                                    type: "five-star",
                                    maxValue: 10,
                                    minValue: 0,
                                    value: 0,
                                }}
                            />
                            <AchievementBar
                                achievement={{
                                    type: "squad",
                                    maxValue: 10,
                                    minValue: 0,
                                    value: 0,
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
