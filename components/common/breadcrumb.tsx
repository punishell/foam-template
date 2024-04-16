"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";
import { ChevronRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";

interface BreadcrumbItem {
    label: string;
    action?: () => void;
    active?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleItemClick = (index: number): void => {
        setActiveIndex(index);
        if (items[index]?.action) {
            items[index]?.action?.();
        }
    };
    return (
        <div className="sticky -top-[1px] left-0 z-50 inline-flex h-[43px] w-full flex-col items-start justify-start gap-2.5 border border-gray-200 bg-neutral-50 px-4 sm:hidden">
            <div className="inline-flex items-start justify-start">
                <div className="flex items-start justify-start">
                    <div className="flex items-center justify-center gap-2">
                        {items?.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2"
                            >
                                {index !== 0 && (
                                    <ChevronRight
                                        size={20}
                                        className="text-gray-500"
                                    />
                                )}
                                <Button
                                    className={`m-0 cursor-pointer p-0 text-sm leading-[21px] tracking-wide ${item.active ?? index === activeIndex ? "font-semibold !text-primary" : "!text-gray-500"}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleItemClick(index);
                                    }}
                                >
                                    {item.label}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
