/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";
import { X } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";

interface TagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

export const TagInput: FC<TagInputProps> = ({ tags, setTags, className, placeholder, disabled }) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            event.preventDefault();
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
        if (event.key === "Backspace" && inputValue === "") {
            setTags(tags.slice(0, -1));
        }
    };

    return (
        <div
            className={`${cn(
                "flex flex-wrap items-center gap-2 rounded-lg border border-line px-2 py-2 duration-200 hover:border-secondary group-focus-within:border-secondary peer-focus-within:border-secondary",
                className,
            )}`}
        >
            {tags.map((tag) => (
                <div
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full border border-primary border-opacity-30 !bg-[#ECFCE5] px-3 py-1 text-sm text-[#198155]"
                >
                    <span>{tag}</span>
                    <button
                        type="button"
                        className="text-[#198155]"
                        onClick={() => {
                            setTags(tags.filter((t) => t !== tag));
                        }}
                        aria-label="Close"
                    >
                        <X size={16} strokeWidth={1} />
                    </button>
                </div>
            ))}
            <input
                type="text"
                className="peer flex-grow outline-none disabled:!bg-transparent"
                placeholder={placeholder ?? "Add skills"}
                value={inputValue}
                onChange={(event) => {
                    setInputValue(event.target.value);
                }}
                onKeyDown={handleKeyDown}
                disabled={disabled}
            />
        </div>
    );
};
