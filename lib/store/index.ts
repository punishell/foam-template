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
    scrollPosition: 1,
    setScrollPosition: (scrollPosition: number) => {
        set({ scrollPosition });
    },
}));

interface LeaderboardProps {
    leaderboardView: boolean;
    setLeaderboardView: (leaderboardView: boolean) => void;
}

export const useLeaderboard = create<LeaderboardProps>((set) => ({
    leaderboardView: false,
    setLeaderboardView: (leaderboardView: boolean) => {
        set({ leaderboardView });
    },
}));
