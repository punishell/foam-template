"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUserState } from "@/lib/store/account";

export const HelloUser = (): JSX.Element => {
    const { firstName } = useUserState();
    return (
        <div className="w-full px-4 sm:px-0 max-sm:pt-4">
            <h3 className="text-2xl font-bold leading-[31.20px] tracking-wide text-gray-800 sm:hidden">
                Hello {firstName}!
            </h3>
        </div>
    );
};
