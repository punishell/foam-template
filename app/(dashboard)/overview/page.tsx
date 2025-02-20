/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { DesktopOverviewHeader } from "@/components/overview/header";
import { JobHeader } from "@/components/overview/sub-header";
import { LeaderBoard } from "@/components/overview/leaderboard";
import Kyc from "@/components/kyc";
import { FeedTabs } from "@/components/overview/tabs";
import { HelloUser } from "@/components/common/hello";

export default function Overview(): React.JSX.Element {
    return (
        <div className="flex h-screen flex-col gap-6 sm:overflow-hidden">
            <div className="flex h-full w-full justify-start gap-6">
                <div className="flex h-full w-full grow flex-col sm:gap-7">
                    <DesktopOverviewHeader />
                    <HelloUser />
                    <Kyc />
                    <JobHeader />
                    <FeedTabs />
                </div>

                <div className="hidden min-h-full w-full shrink-0 basis-[270px] flex-col items-center overflow-y-auto sm:flex">
                    <div className="scrollbar-hide flex w-full flex-1 basis-0 flex-col gap-2 overflow-y-auto">
                        <LeaderBoard />
                    </div>
                </div>
            </div>
        </div>
    );
}
