"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type createJobSchema } from "@/lib/validations";

import { SkillInput } from "./skill-input";

type FormValues = z.infer<typeof createJobSchema>;

interface PreferredSkillsProps {
    form: UseFormReturn<FormValues>;
    isEdit?: boolean;
}

const PreferredSkills = ({
    form,
    isEdit,
}: PreferredSkillsProps): ReactElement => {
    return (
        <div className="flex w-full flex-col gap-2">
            <h3 className="flex flex-col items-start text-lg font-bold text-black sm:flex-row sm:items-center sm:gap-4 sm:font-medium">
                Preferred Skills
                {!isEdit && (
                    <span className="text-sm font-thin text-body">
                        You can add up to three
                    </span>
                )}
            </h3>
            <div className="flex w-full flex-wrap items-start gap-2 sm:justify-start">
                <div className="flex flex-col">
                    <SkillInput form={form} name="firstSkill" />
                    <span className="left-2 mt-2 flex  w-auto">
                        {form.formState.errors.firstSkill?.message != null && (
                            <span className="text-sm text-red-500">
                                {form.formState.errors.firstSkill?.message}
                            </span>
                        )}
                    </span>
                </div>
                <div className="flex flex-col">
                    <SkillInput form={form} name="secondSkill" />
                    <span className="left-2 mt-2 flex w-auto">
                        {form.formState.errors.secondSkill?.message != null && (
                            <span className="text-sm text-red-500">
                                {form.formState.errors.secondSkill?.message}
                            </span>
                        )}
                    </span>
                </div>
                <div className="flex flex-col">
                    <SkillInput form={form} name="thirdSkill" />
                    <span className="left-2 mt-2 flex w-full">
                        {form.formState.errors.thirdSkill?.message != null && (
                            <span className="text-sm text-red-500">
                                {form.formState.errors.thirdSkill?.message}
                            </span>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PreferredSkills;
