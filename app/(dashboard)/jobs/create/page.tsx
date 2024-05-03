"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import CreateJobForm from "@/components/forms/create-job";
import { createJobSchema } from "@/lib/validations";
import Steps from "@/components/jobs/misc/steps";
import { Breadcrumb } from "@/components/common/breadcrumb";

type FormValues = z.infer<typeof createJobSchema>;

export default function CreateJobPage(): React.JSX.Element {
    const router = useRouter();

    const form = useForm<FormValues>({
        reValidateMode: "onChange",
        mode: "all",
        resolver: zodResolver(createJobSchema),
    });

    const jobSteps = {
        details:
            form.watch("title") !== "" &&
            !form.getFieldState("title").invalid &&
            form.watch("due") !== undefined &&
            !form.getFieldState("due").invalid &&
            form.watch("budget") !== 0 &&
            !form.getFieldState("budget").invalid,
        skills:
            form.watch("firstSkill") !== "" &&
            form.watch("firstSkill") !== undefined &&
            !form.getFieldState("firstSkill").invalid,
        description:
            form.watch("description") !== "" &&
            form.watch("description") !== undefined &&
            !form.getFieldState("description").invalid,
        deliverables:
            Array.isArray(form.watch("deliverables")) &&
            form
                .watch("deliverables")
                .filter((r) => r !== undefined && r !== "").length > 0 &&
            !form.getFieldState("deliverables").invalid,
        classification:
            form.watch("visibility") !== undefined &&
            !form.getFieldState("visibility").invalid &&
            form.watch("category") !== undefined &&
            !form.getFieldState("category").invalid,
    };

    return (
        <div className="flex h-full w-full overflow-y-auto sm:gap-6 sm:pb-10 max-sm:flex-col">
            <Breadcrumb
                items={[
                    {
                        label: "Jobs",
                        action: () => {
                            router.push("/jobs");
                        },
                    },
                    {
                        label: "Create Job",
                        active: true,
                        action: () => {
                            router.push("/jobs/create");
                        },
                    },
                ]}
            />
            <CreateJobForm form={form} />
            <div className="flex shrink-0 grow-0 basis-[300px] flex-col gap-6 max-sm:hidden">
                <Steps jobSteps={jobSteps} />
            </div>
        </div>
    );
}
