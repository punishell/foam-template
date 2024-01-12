"use client";

import { Button } from "pakt-ui";
import { useRouter } from "next/navigation";
import { Search, Plus, Briefcase } from "lucide-react";
import { Tabs } from "@/components/common/tabs";
import { Feeds } from "@/components/overview/feeds";
import { Header } from "@/components/overview/header";
import { LeaderBoard } from "@/components/overview/leaderboard";
import { Invites } from "@/components/overview/invites";
import { ActiveJobs } from "@/components/overview/activeJobs";
import { FeedsBookmark } from "@/components/overview/bookmark";
import { useUserState } from "@/lib/store/account";

export default function Overview() {
    return (
        <div className="flex h-screen flex-col gap-6 overflow-hidden">
            <div className="flex h-full w-full justify-start gap-6">
                <div className="flex h-full w-full grow flex-col gap-7">
                    <Header />
                    <JobHeader />
                    <div className="flex flex-1 basis-0 overflow-y-auto">
                        <Tabs
                            tabs={[
                                { label: "Your Feed", value: "feed", content: <Feeds /> },
                                { label: "Active Jobs", value: "active", content: <ActiveJobs /> },
                                { label: "Invites", value: "invites", content: <Invites /> },
                                { label: "Bookmarks", value: "bookmarks", content: <FeedsBookmark /> },
                            ]}
                        />
                    </div>
                </div>

                <div className="xw-fit flex min-h-full w-full shrink-0 basis-[270px] flex-col items-center overflow-y-auto">
                    <div className="scrollbar-hide flex w-full flex-1 basis-0 flex-col gap-2 overflow-y-auto">
                        <LeaderBoard />
                    </div>
                </div>
            </div>
        </div>
    );
}

const JobHeader = (): React.JSX.Element => {
    const router = useRouter();
    const user = useUserState();
    const value = user.profileCompleteness ?? 0;
    const profileCompleted = value > 70;
    if (!profileCompleted) {
        return (
            <div className="flex h-[154px] w-full gap-2 rounded-2xl border bg-white p-2">
                <div className="flex flex-[8] items-center">
                    <div className="flex flex-[2] flex-col items-center text-center">
                        <h3 className="text-[50px] font-bold leading-[54px]">{value}%</h3>
                        <p className="text-base">of your profile is completed</p>
                    </div>
                    <div className="flex flex-[7] flex-col gap-2 border-l-[1px] border-[#e8e8e8] pl-[24px]">
                        {/* <h4 className="text-xl font-bold">Complete your profile to start Applying for Jobs and Projects</h4> */}
                        <p className="text-base leading-6 tracking-[0.75px] text-body">
                            Welcome to Afrofund! Fill out your profile so you can begin collaborating.
                        </p>
                        <div className="h-[48px] w-[226px]">
                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => {
                                    router.push("/settings");
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    <span>Complete Profile</span>
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-[#ECFCE5] p-4">
                <div className="relative z-10 flex flex-col gap-4">
                    <p className="max-w-[300px] text-xl font-bold">
                        Search Afrofund Talent Pool to find skilled workers.
                    </p>
                    <Button
                        size="sm"
                        onClick={() => {
                            router.push("/jobs/create");
                        }}
                    >
                        <span className="flex items-center gap-2">
                            <Plus size={20} />
                            <span>Create Job</span>
                        </span>
                    </Button>
                </div>

                <div className="absolute right-0 top-2 translate-x-1/3">
                    <Briefcase size={200} color="#B4EDB6" />
                </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-blue-darkest bg-[#C9F0FF] p-4">
                <div className="relative z-10 flex flex-col gap-4">
                    <p className="max-w-[320px] text-xl font-bold">
                        Search the Afrofund job board for work that matches your skills.
                    </p>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            router.push("/jobs");
                        }}
                    >
                        <span className="flex items-center gap-2">
                            <Search size={20} />
                            <span>Find Jobs</span>
                        </span>
                    </Button>
                </div>

                <div className="absolute right-0 top-4 translate-x-[30px] ">
                    <Search size={150} color="#9BDCFD" />
                </div>
            </div>
        </div>
    );
};
