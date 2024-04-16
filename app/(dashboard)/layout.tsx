"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode, useState, useEffect } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { useIdleTimer } from "react-idle-timer";
import { useQueryClient } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetAccount } from "@/lib/api/account";
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { MessagingProvider } from "@/providers/socketProvider";
import { axios } from "@/lib/axios";
import { Sidebar } from "@/components/navigations/side-nav";
import { PageLoading } from "@/components/common/page-loading";
import { BottomNav } from "@/components/navigations/mobile-nav/footer";
import { MobileHeader } from "@/components/navigations/mobile-nav/header";
import { MobileLeaderBoard } from "@/components/overview/leaderboard/mobile";
import JobAction from "@/components/navigations/job-actions";
import { useHeaderScroll } from "@/lib/store";
import { LogoutAlert } from "@/components/common/logout-alert";
import { GlobalBgVector } from "@/components/common/global-gradient-bg-vector";

function Loader(): React.JSX.Element {
    return (
        <div
            aria-live="polite"
            aria-busy="true"
            className="flex h-screen w-screen items-center justify-center"
        >
            <PageLoading color="#007C5B" />
        </div>
    );
}

interface DashProps {
    children: ReactNode;
    // eslint-disable-next-line react/require-default-props
    tokenSet?: boolean;
}

function AccountWrapper({
    children,
    tokenSet = false,
}: DashProps): React.JSX.Element {
    const { isFetched, isFetching } = useGetAccount();

    if (!tokenSet || (!isFetched && isFetching)) {
        return <Loader />;
    }

    return children as React.JSX.Element;
}

const SIX_MINUTES_IN_MS = 6 * 60 * 1000;

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}): React.JSX.Element {
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const token = getCookie(AUTH_TOKEN_KEY) as string;
    const [isTokenSet, setIsTokenSet] = useState(false);

    const [remainingTime, setRemainingTime] = useState(0);
    const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);

    const { scrollPosition } = useHeaderScroll();

    const onIdle = (): void => {
        setIsTimeoutModalOpen(false);
        queryClient.clear();
        router.push("/login");
        deleteCookie(AUTH_TOKEN_KEY);
    };

    const onActive = (): void => {
        setIsTimeoutModalOpen(false);
    };

    const onPrompt = (): void => {
        setIsTimeoutModalOpen(true);
    };

    const { getRemainingTime, activate } = useIdleTimer({
        onIdle,
        onActive,
        onPrompt,
        timeout: SIX_MINUTES_IN_MS,
        promptBeforeIdle: SIX_MINUTES_IN_MS / 2,
    });

    const stayActive = (): void => {
        setIsTimeoutModalOpen(false);
        setTimeout(() => {
            activate();
        }, 1000);
    };

    const Logout = (): void => {
        deleteCookie(AUTH_TOKEN_KEY);
        queryClient.clear();
        router.push("/login");
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingTime(getRemainingTime());
        }, 10);

        return () => {
            clearInterval(intervalId);
        };
    }, [getRemainingTime]);

    useEffect(() => {
        if (token !== "") {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            setIsTokenSet(true);
        }
        return () => {
            axios.defaults.headers.common.Authorization = "";
        };
    }, [router, token]);

    useEffect(() => {
        // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
        const onWindowResize = (): void => {
            document.documentElement.style.setProperty(
                "--vh",
                `${window.innerHeight * 0.01}px`
            );
        };

        window.addEventListener("resize", onWindowResize, false);
        onWindowResize();

        return () => {
            window.removeEventListener("resize", onWindowResize, false);
        };
    }, []);

    if (!isTokenSet) {
        return <Loader />;
    }

    return (
        <AccountWrapper tokenSet={isTokenSet}>
            <MessagingProvider>
                <div className="flex h-screen w-screen max-w-full flex-col overflow-y-hidden sm:flex-row">
                    <Sidebar />
                    <div
                        className={`relative w-full transition-all duration-300 ${scrollPosition > 0 ? "h-[calc(100vh-129px)]" : "h-[calc(100vh-207px)]"} sm:h-[inherit]`}
                    >
                        <GlobalBgVector />
                        <div className="absolute inset-0 bg-[url(/images/rain.png)] bg-repeat opacity-50 max-sm:h-screen" />
                        <LogoutAlert
                            isTimeoutModalOpen={isTimeoutModalOpen}
                            remainingTime={remainingTime}
                            stayActive={stayActive}
                            Logout={Logout}
                        />
                        <MobileHeader />
                        <div className="relative z-10 flex h-full flex-col sm:isolate sm:flex-1 sm:px-4 sm:pt-5 2xl:px-8">
                            {children}
                        </div>
                        {pathname === "/overview" && <JobAction />}
                        <BottomNav />
                        <MobileLeaderBoard />
                    </div>
                </div>
            </MessagingProvider>
        </AccountWrapper>
    );
}
