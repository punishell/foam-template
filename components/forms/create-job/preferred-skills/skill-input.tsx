"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type * as z from "zod";
import { Check } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type createJobSchema } from "@/lib/validations";
import { type CategoryData, useGetCategory } from "@/lib/api/category";
import { Spinner } from "@/components/common";
import { disallowedChars, filterSkillsByName, sentenceCase } from "@/lib/utils";

type FormValues = z.infer<typeof createJobSchema>;

interface SkillInputProps {
    form: UseFormReturn<FormValues>;
    name: "thirdSkill" | "secondSkill" | "firstSkill";
}
interface CategoryList {
    label: string;
    value: string;
}

export const SkillInput = ({ form, name }: SkillInputProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [skillValue, setSkillValue] = useState<string>("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const optionRefs = useRef<HTMLDivElement[]>([]);

    const { data, isFetching, isLoading } = useGetCategory(skillValue);
    const categories = data?.data ?? [];
    const ct = filterSkillsByName(categories, disallowedChars);

    const CATEGORY_LIST: CategoryList[] = (ct || []).map((c: CategoryData) => ({
        label: c.name,
        value: c.name,
    }));

    // Filter with skillValue/inputValue
    const filteredCategoryList: CategoryList[] = CATEGORY_LIST.filter(
        (category) => {
            return category.label
                .toLowerCase()
                .includes(skillValue.toLowerCase());
        }
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault(); // Prevent the cursor from moving
                setIsOpen(true); // Open dropdown if not already open
                setHighlightedIndex(
                    (prevIndex) => (prevIndex + 1) % filteredCategoryList.length
                );
                break;
            case "ArrowUp":
                e.preventDefault(); // Prevent the cursor from moving
                setIsOpen(true); // Ensure dropdown is open
                setHighlightedIndex(
                    (prevIndex) =>
                        (prevIndex - 1 + filteredCategoryList.length) %
                        filteredCategoryList.length
                );
                break;
            case "Enter":
                e.preventDefault();
                if (highlightedIndex !== -1 && isOpen) {
                    // setSkillValue(filteredCategoryList[highlightedIndex].label); // Set input value to selected option's label
                    setIsOpen(false); // Close dropdown
                    setHighlightedIndex(-1); // Reset highlighted index
                    form.setValue(
                        name,
                        // @ts-expect-error --- TS doesn't know that form is a UseFormReturn
                        filteredCategoryList[highlightedIndex].label,
                        { shouldValidate: true }
                    );
                    void form.trigger(name);
                }
                break;
            case "Escape":
                setIsOpen(false);
                setHighlightedIndex(-1); // Reset highlighted index
                break;
            case "Tab":
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
            default:
                setIsOpen(true); // Open dropdown if starting to type
                break;
        }
    };

    // Close dropdown when pressing backspace
    useEffect(() => {
        // Check if the input element exists
        if (inputRef.current) {
            // Event handler function
            const hkd = (event: KeyboardEvent): void => {
                if (event.key === "Backspace" && skillValue.length === 1) {
                    setIsOpen(true);
                }
            };

            // Add event listener to the input element
            const inputElement = inputRef.current;
            inputElement.addEventListener("keydown", hkd);

            // Cleanup function
            return () => {
                inputElement.removeEventListener("keydown", hkd);
            };
        }

        return () => {};
    }, [inputRef, skillValue.length]);

    // Close dropdown when no results
    useEffect(() => {
        if (filteredCategoryList.length === 0 && !isLoading && !isFetching) {
            setIsOpen(false);
        }
    }, [filteredCategoryList.length, isFetching, isLoading]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        optionRefs.current = optionRefs.current.slice(
            0,
            filteredCategoryList.length
        );
    }, [filteredCategoryList]);

    // Scroll to highlighted option
    useEffect(() => {
        if (isOpen && highlightedIndex !== -1) {
            const optionElement = optionRefs.current[highlightedIndex];
            if (optionElement && dropdownRef.current) {
                const dropdown = dropdownRef.current;
                const option = optionElement;

                const dropdownRect = dropdown.getBoundingClientRect();
                const optionRect = option.getBoundingClientRect();

                // Define a threshold or padding for the scroll.
                const scrollPadding = 20; // This is the threshold/padding amount in pixels.

                // Scroll up if the option is above the viewable area.
                if (optionRect.top < dropdownRect.top + scrollPadding) {
                    dropdown.scrollTop = option.offsetTop - scrollPadding;
                }
                // Scroll down if the option is below the viewable area.
                else if (
                    optionRect.bottom >
                    dropdownRect.bottom - scrollPadding
                ) {
                    dropdown.scrollTop =
                        option.offsetTop +
                        option.offsetHeight -
                        dropdown.offsetHeight +
                        scrollPadding;
                }
            }
        }
    }, [highlightedIndex, isOpen]);

    return (
        <Controller
            name={name}
            control={form?.control}
            render={({ field: { onChange, value } }) => {
                return (
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Enter skill"
                            className="z-50 h-full w-fit rounded-full !border !border-line bg-[#F2F4F5] py-3 pl-4 text-base focus:outline-none"
                            onChange={(e) => {
                                onChange(e.target.value);
                                setSkillValue(e.target.value);
                            }}
                            value={sentenceCase(value ?? "")}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                setIsOpen(true);
                                void form.trigger(name);
                            }}
                            ref={inputRef}
                            maxLength={20}
                        />
                        {isOpen && (
                            <div
                                className="absolute z-50 max-h-[200px] min-w-[271px] translate-x-1 translate-y-2 gap-4 overflow-hidden overflow-y-auto rounded-lg border border-green-300 bg-white p-4 shadow max-sm:hidden"
                                style={{
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                }}
                                ref={dropdownRef}
                            >
                                {isFetching || isLoading ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        {filteredCategoryList.map(
                                            ({ label, value: v }, index) => (
                                                <button
                                                    key={v}
                                                    className={`${highlightedIndex === index ? "bg-[#ECFCE5]" : ""} relative flex w-full cursor-pointer select-none items-center rounded p-2 text-base outline-none hover:bg-[#ECFCE5]`}
                                                    onClick={() => {
                                                        onChange(label);
                                                        setIsOpen(false);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === "Enter" ||
                                                            e.key === " "
                                                        ) {
                                                            onChange(label);
                                                            setIsOpen(false);
                                                        }
                                                    }}
                                                    type="button"
                                                    ref={(el) => {
                                                        // Store a reference to each option element
                                                        // @ts-expect-error --- TS doesn't know that optionRefs is a ref to an array of divs
                                                        optionRefs.current[
                                                            index
                                                        ] = el;
                                                    }}
                                                >
                                                    {sentenceCase(label)}
                                                    {label === value && (
                                                        <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
                                                            <Check className="h-4 w-4" />
                                                        </span>
                                                    )}
                                                </button>
                                            )
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                );
            }}
        />
    );
};
