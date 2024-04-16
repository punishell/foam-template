"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery, useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentsMobileView } from "@/components/talent/mobile-view";
import { TalentsDesktopView } from "@/components/talent/desktop-view";

export default function TalentsPage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	const isClient = useIsClient();
	return isClient && (tab ? <TalentsDesktopView /> : <TalentsMobileView />);
}
