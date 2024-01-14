"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { forwardRef } from "react";

type SkillInputProps = React.ComponentPropsWithRef<"input">;

export const SkillInput = forwardRef<HTMLInputElement, SkillInputProps>(({ ...props }, ref) => {
    return (
        <input
            ref={ref}
            {...props}
            type="text"
            placeholder="Enter skill"
            className="h-full w-fit rounded-full border border-line bg-[#F2F4F5] py-3 pl-4 text-base focus:outline-none"
        />
    );
});

SkillInput.displayName = "SkillInput";
