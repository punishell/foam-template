"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Button } from "pakt-ui";
import { X, Bookmark, Gavel } from "lucide-react";
import Lottie from "lottie-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import win from "@/lottiefiles/win.json";

export const IssueResolutionResolveFeed = (): ReactElement => {
    return (
        <div className="relative z-10 flex w-full gap-4 overflow-hidden rounded-2xl border border-[#7DDE86] bg-[#FBFFFA] p-4">
            <div className="flex w-[148px] items-center justify-center">
                <Lottie animationData={win} loop />
            </div>

            <div className="flex w-full flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-title">
                        You Won Your Issue Resolution
                    </h3>

                    <X size={20} />
                </div>

                <p className="text-base text-body">
                    After thorough review of the provided evidence for the [job]
                    issue, the jury decided that you were correct.
                </p>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button size="xs" variant="primary">
                            See Verdict
                        </Button>
                    </div>
                    <Bookmark size={20} />
                </div>
            </div>

            <div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
                <Gavel size={200} color="#ECFCE5" />
            </div>
        </div>
    );
};
