"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery, useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { MobileTalent } from "@/components/talent/mobile-talent";
import { DesktopTalents } from "@/components/talent/desktop-talent";

export default function TalentsPage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	const isClient = useIsClient();
	return isClient && (tab ? <DesktopTalents /> : <MobileTalent />);
}
