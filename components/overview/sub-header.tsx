"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { Search, Plus, Briefcase } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { useUserState } from "@/lib/store/account";

export const JobHeader = (): React.JSX.Element => {
    const router = useRouter();
    const { firstName, profileCompleteness } = useUserState();
    const value = profileCompleteness ?? 0;
    const profileCompleted = value > 70;

    if (!profileCompleted) {
        return (
            <div className="flex w-full flex-col items-start gap-4 px-4 sm:h-[154px] sm:px-0 max-sm:py-7">
                <h3 className="text-2xl font-bold leading-[31.20px] tracking-wide text-gray-800 sm:hidden">
                    Hello {firstName}!
                </h3>
                <div className="flex h-full w-full gap-2 rounded-2xl border bg-white p-4 sm:p-2">
                    <div className="flex flex-[8] items-center">
                        <div className="hidden flex-[2] flex-col items-center text-center sm:flex">
                            <h3 className="text-[50px] font-bold leading-[54px]">
                                {value}%
                            </h3>
                            <p className="text-base">
                                of your profile is completed
                            </p>
                        </div>
                        <div className="flex flex-[7] flex-col gap-4 sm:gap-2 sm:border-l-[1px] sm:border-[#e8e8e8] sm:pl-[24px]">
                            <p className="hidden text-base leading-6 tracking-[0.75px] text-body sm:block">
                                Welcome to Afrofund! Fill out your profile so
                                you can begin collaborating.
                            </p>
                            <p className="text-base leading-6 tracking-[0.75px] text-body sm:hidden">
                                Welcome to Afrofund! <br /> Fill out your skills
                                -- The more complete it is, the more likely you
                                are to get hired.
                            </p>
                            <div className="h-[48px] w-full sm:w-[226px]">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={() => {
                                        router.push("/settings");
                                    }}
                                    className="rounded-[10px] max-sm:!w-full"
                                >
                                    <span className="flex items-center gap-2">
                                        <span>Complete Profile</span>
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="hidden grid-cols-2 gap-4 sm:grid">
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-[#ECFCE5] p-4">
                <div className="relative z-10 flex flex-col gap-4">
                    <p className="max-w-[300px] text-xl font-bold">
                        Create a job to hire skilled workers from the talent
                        pool.
                    </p>
                    <Button
                        size="lg"
                        onClick={() => {
                            router.push("/jobs/create");
                        }}
                        variant="primary"
                        className="flex w-max items-center gap-2 text-[19.06px]"
                    >
                        <Plus size={20} />
                        <span>Create Job</span>
                    </Button>
                </div>

                <div className="absolute right-0 top-2 translate-x-1/3">
                    <Briefcase size={200} color="#B4EDB6" />
                </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-blue-darkest bg-[#C9F0FF] p-4">
                <div className="relative z-10 flex flex-col gap-4">
                    <p className="max-w-[320px] text-xl font-bold">
                        Search the Afrofund job board for work that matches your
                        skills.
                    </p>
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => {
                            router.push("/jobs");
                        }}
                        className="flex w-max items-center gap-2 text-[19.06px]"
                    >
                        <Search size={20} />
                        <span>Find Jobs</span>
                    </Button>
                </div>

                <div className="absolute right-0 top-4 translate-x-[30px] ">
                    <Search size={150} color="#9BDCFD" />
                </div>
            </div>
        </div>
    );
};
