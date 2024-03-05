/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

export * from "./security";

interface HeaderScroll {
	scrollPosition: number;
	setScrollPosition: (loading: number) => void;
}

export const useHeaderScroll = create<HeaderScroll>((set) => ({
	scrollPosition: 0,
	setScrollPosition: (scrollPosition: number) => {
		set({ scrollPosition });
	},
}));
