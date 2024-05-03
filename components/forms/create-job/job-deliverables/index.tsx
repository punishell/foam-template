"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type createJobSchema } from "@/lib/validations";
import { DeliverablesInput } from "./deliverables-input";

type FormValues = z.infer<typeof createJobSchema>;

interface JobDeliverablesProps {
    form: UseFormReturn<FormValues>;
    isEdit?: boolean;
}

const JobDeliverables = ({
    form,
    isEdit,
}: JobDeliverablesProps): ReactElement => {
    return (
        <div className="flex flex-col gap-2">
            <h3 className="flex flex-col items-start text-lg font-bold text-black sm:flex-row sm:items-center sm:gap-4 sm:font-medium">
                Deliverables{" "}
                {!isEdit && (
                    <span className="text-sm font-thin text-body">
                        You can create up to five deliverables
                    </span>
                )}
            </h3>
            <div className="relative">
                <Controller
                    name="deliverables"
                    control={form.control}
                    render={({ field: { onChange, value = [] } }) => (
                        <DeliverablesInput
                            deliverables={value}
                            setDeliverables={onChange}
                        />
                    )}
                />
                <span className="absolute -bottom-6 flex w-full">
                    {form.formState.errors.deliverables?.message != null && (
                        <span className="text-sm text-red-500">
                            {form.formState.errors.deliverables?.message}
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
};

export default JobDeliverables;
