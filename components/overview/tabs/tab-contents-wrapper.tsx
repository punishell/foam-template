"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRef } from "react";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEventListener } from "usehooks-ts";
import { useHeaderScroll } from "@/lib/store";

export const TabContentWrapper = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const { setScrollPosition } = useHeaderScroll();
    const scrollParentRef = useRef<HTMLDivElement | null>(null);

    const onScroll = (event: Event): void => {
        const target = event.target as HTMLDivElement;
        // Update the scroll position state
        setScrollPosition(target.scrollTop);
    };

    useEventListener("scroll", onScroll, scrollParentRef);

    return (
        <div
            ref={scrollParentRef}
            className="scrollbar-hide mb-1 w-full overflow-auto bg-white pb-[130px] sm:rounded-2xl sm:border sm:border-line sm:p-4 [&:last]:mb-0 [&>*]:mb-0 sm:[&>*]:mb-5"
        >
            {children}
        </div>
    );
};
