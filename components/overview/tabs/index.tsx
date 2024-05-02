/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Tabs } from "@/components/common/tabs";
import { Feeds } from "@/components/overview/tabs/feeds";
import { Invites } from "@/components/overview/tabs/invites";
import { ActiveJobs } from "@/components/overview/tabs/active-jobs";
import { FeedsBookmark } from "@/components/overview/tabs/bookmark";

export const FeedTabs = (): JSX.Element => {
    return (
        <div className="flex flex-1 basis-0 overflow-y-auto">
            <Tabs
                tabs={[
                    {
                        label: "Your Feed",
                        value: "feed",
                        content: <Feeds />,
                    },
                    {
                        label: "Active Jobs",
                        value: "active",
                        content: <ActiveJobs />,
                    },
                    {
                        label: "Invites",
                        value: "invites",
                        content: <Invites />,
                    },
                    {
                        label: "Bookmarks",
                        value: "bookmarks",
                        content: <FeedsBookmark />,
                    },
                ]}
            />
        </div>
    );
};
