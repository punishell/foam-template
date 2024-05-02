"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { Plus, Search } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "../common/button";

const JobAction = (): JSX.Element => {
    const [showButtons, setShowButtons] = useState(false);

    const toggleButtons = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();
        setShowButtons(!showButtons);
    };

    return (
        <div className="fixed bottom-[15%] right-[10%] z-30 sm:hidden">
            <div className="relative">
                <div
                    className={`absolute right-0 top-0 flex origin-bottom-right flex-col space-y-2 transition-all duration-300 ${showButtons ? "z-10 -translate-y-[120%] opacity-100" : "z-1 -translate-y-[0] opacity-0"} `}
                >
                    <Button
                        className="flex items-center gap-2.5"
                        variant="primary"
                        size="lg"
                    >
                        <Plus size={20} /> Create Job
                    </Button>
                    <Button
                        className="flex items-center gap-2.5"
                        variant="secondary"
                        size="lg"
                    >
                        <Search size={20} /> Find Job
                    </Button>
                </div>
                <div className="relative">
                    <Button
                        className="relative z-20 h-[68px] w-[68px] cursor-pointer rounded-full bg-primary px-4 py-2 text-white !opacity-100 shadow hover:!bg-primary"
                        onClick={toggleButtons}
                        type="button"
                    >
                        <Plus
                            size={37}
                            className={`transform transition-all duration-300 ${showButtons ? "rotate-45" : ""}`}
                        />
                    </Button>
                    <div className="cancel-drag" />
                </div>
            </div>
        </div>
    );
};

export default JobAction;
