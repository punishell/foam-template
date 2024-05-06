"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { endOfYesterday } from "date-fns";
import { Controller, type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type createJobSchema } from "@/lib/validations";
import { DatePicker } from "@/components/common/date-picker";

type FormValues = z.infer<typeof createJobSchema>;

interface JobDueDateProps {
    form: UseFormReturn<FormValues>;
}

const JobDueDate = ({ form }: JobDueDateProps): ReactElement => {
    return (
        <div className="relative w-1/2">
            <Controller
                name="due"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                    <DatePicker
                        className="h-[45px] w-full border-[#0065D0CC] bg-[#C9F0FF] text-[#0065D0CC] sm:w-[250px]"
                        placeholder="Select Due Date"
                        selected={value}
                        onSelect={(date) => {
                            onChange(date);
                        }}
                        disabled={(date) => date < endOfYesterday()}
                    />
                )}
            />
            <span className="mt-2 flex w-full">
                {form.formState.errors.due?.message != null && (
                    <span className="text-sm text-red-200">
                        {form.formState.errors.due?.message}
                    </span>
                )}
            </span>
        </div>
    );
};

export default JobDueDate;
