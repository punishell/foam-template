"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery, useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import JobsDesktopView from "@/components/jobs/desktop-view";
import JobsMobileView from "@/components/jobs/mobile-view";

export default function JobsPage(): React.JSX.Element {
    const tab = useMediaQuery("(min-width: 640px)");
    const isClient = useIsClient();
    return isClient && (tab ? <JobsDesktopView /> : <JobsMobileView />);
}
