"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "pakt-ui";
import { endOfYesterday, format } from "date-fns";
import * as z from "zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type Job, isJobDeliverable } from "@/lib/types";
import { useGetJobById, useUpdateJob, useInviteTalentToJob } from "@/lib/api/job";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { Spinner } from "@/components/common";
import { NumericInput } from "@/components/common/numeric-input";
import { DatePicker } from "@/components/common/date-picker";
import { DeliverablesInput } from "@/components/jobs/deliverables-input";
import { DollarIcon } from "@/components/common/icons";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/common/select";
import { filterEmptyStrings } from "@/lib/utils";

import { StepIndicator } from "@/components/jobs/step-indicator";

const CATEGORY_OPTIONS = [
    { label: "Design", value: "design" },
    { label: "Engineering", value: "engineering" },
    { label: "Product", value: "product" },
    { label: "Marketing", value: "marketing" },
    { label: "Copywriting", value: "copywriting" },
    { label: "Others", value: "others" },
];

const schema = z.object({
    due: z.date({
        required_error: "Due date is required",
    }),
    visibility: z.string().nonempty({ message: "Required" }),
    thirdSkill: z.string().optional().default(""),
    secondSkill: z.string().optional().default(""),
    firstSkill: z.string().nonempty({ message: "At least, one skill is required" }),
    budget: z.coerce.number().min(100, { message: "Budget must be at least $100" }),
    title: z.string().nonempty({ message: "Job title is required" }),
    description: z.string().nonempty({ message: "Job description is required" }),
    category: z.string().nonempty({ message: "Required" }),
    deliverables: z
        .array(z.string(), {
            required_error: "At least, one deliverable is required",
        })
        .max(5, {
            message: "You can add up to 5 deliverables",
        }),
});

type FormValues = z.infer<typeof schema>;

type SkillInputProps = React.ComponentPropsWithRef<"input">;

const SkillInput = React.forwardRef<HTMLInputElement, SkillInputProps>(({ ...props }, ref) => {
    return (
        <input
            ref={ref}
            {...props}
            type="text"
            placeholder="Enter skill"
            className="h-full w-fit rounded-full border border-line bg-[#F2F4F5] py-3 pl-4 text-base focus:outline-none"
        />
    );
});

SkillInput.displayName = "SkillInput";

interface JobEditFormProps {
    job: Job;
}

const JobEditForm: React.FC<JobEditFormProps> = ({ job }) => {
    const router = useRouter();
    const params = useSearchParams();

    const updateJob = useUpdateJob();
    const talentId = params.get("talent-id") ?? "";
    const inviteTalent = useInviteTalentToJob({ talentId, job });

    // const [files, setFiles] = React.useState<File[]>([]);
    // const [uploadProgress, setUploadProgress] = React.useState(0);

    // const onDrop = React.useCallback(async (acceptedFiles: File[]) => {}, []);

    // const { getRootProps, getInputProps } = useDropzone({
    //   onDrop,
    //   maxFiles: 5,
    //   accept: {},
    // });

    const form = useForm<FormValues>({
        reValidateMode: "onChange",
        resolver: zodResolver(schema),
        defaultValues: {
            budget: job.paymentFee,
            deliverables: job.collections.filter(isJobDeliverable).map((collection) => collection.name),
            title: job?.name,
            category: job?.category,
            description: job?.description,
            due: new Date(job?.deliveryDate),
            firstSkill: job?.tagsData[0] ?? "",
            thirdSkill: job?.tagsData[2] ?? "",
            secondSkill: job?.tagsData[1] ?? "",
            visibility: job?.isPrivate ? "private" : "public",
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async ({
        budget,
        category,
        deliverables,
        description,
        due,
        firstSkill,
        title,
        visibility,
        secondSkill,
        thirdSkill,
    }) => {
        updateJob.mutate(
            {
                id: job._id,
                name: title,
                tags: filterEmptyStrings([firstSkill, secondSkill, thirdSkill]),
                category,
                description,
                deliverables,
                paymentFee: Number(budget),
                isPrivate: visibility === "private",
                deliveryDate: format(due, "yyyy-MM-dd"),
            },
            {
                onSuccess(_data, { id }) {
                    if (talentId && job.escrowPaid) {
                        inviteTalent.mutate(
                            {
                                talentId,
                                jobId: id,
                            },
                            {
                                onSuccess() {
                                    router.push(`/jobs/${id}`);
                                },
                            },
                        );
                    }
                    if (talentId) {
                        router.push(`/jobs/${id}/make-deposit/?talent-id=${talentId}`);
                    } else {
                        router.push(`/jobs/${id}`);
                    }
                },
            },
        );
    };

    const jobSteps = {
        details:
            !!form.watch("title") &&
            !form.getFieldState("title").invalid &&
            !!form.watch("due") &&
            !form.getFieldState("due").invalid &&
            !!form.watch("budget") &&
            !form.getFieldState("budget").invalid,
        skills: !!form.watch("firstSkill") && !form.getFieldState("firstSkill").invalid,
        description: !!form.watch("description") && !form.getFieldState("description").invalid,
        deliverables:
            Array.isArray(form.watch("deliverables")) &&
            form.watch("deliverables").filter((r) => r !== "").length > 0 &&
            !form.getFieldState("deliverables").invalid,
        classification:
            !!form.watch("visibility") &&
            !form.getFieldState("visibility").invalid &&
            !!form.watch("category") &&
            !form.getFieldState("category").invalid,
    };

    return (
        <div className="flex h-full gap-6 pb-10">
            <div className="w-full overflow-hidden overflow-y-auto rounded-2xl border border-line">
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Error Triggered due to the addition of `onKeyDown` attribute */}
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                        }
                    }}
                    className="flex h-fit grow flex-col rounded-2xl bg-white"
                >
                    <div className="flex flex-col gap-10 rounded-t-2xl bg-primary-gradient p-6 pb-8">
                        <div className="relative">
                            <input
                                type="text"
                                // eslint-disable-next-line jsx-a11y/no-autofocus -- The autoFocus prop should not be used, as it can reduce usability and accessibility for users.
                                autoFocus
                                maxLength={60}
                                {...form.register("title")}
                                placeholder="Enter Job Title"
                                className="w-full bg-transparent text-3xl text-white caret-white placeholder:text-white placeholder:text-opacity-60 focus:outline-none"
                            />
                            <div className="ml-auto text-right text-sm text-white">
                                {form.watch("title")?.length}/ 60
                            </div>
                            <span className="absolute -bottom-5 flex w-full">
                                {form.formState.errors.title?.message && (
                                    <span className="text-sm text-red-200">{form.formState.errors.title?.message}</span>
                                )}
                            </span>
                        </div>

                        <div className="flex w-full items-center gap-8">
                            <div className="flex w-fit max-w-xl gap-4">
                                <div className="relative">
                                    <div className="flex h-[45px] items-center rounded-lg border-[#198155] bg-[#ECFCE5] p-2 text-primary">
                                        <DollarIcon />
                                        <NumericInput
                                            type="text"
                                            {...form.register("budget")}
                                            placeholder="Enter Proposed Price"
                                            className="h-full  bg-transparent text-base placeholder:text-primary focus:outline-none"
                                        />
                                    </div>
                                    <span className="absolute -bottom-5 flex w-full">
                                        {form.formState.errors.budget?.message && (
                                            <span className="text-sm text-red-200">
                                                {form.formState.errors.budget?.message}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="relative">
                                    <Controller
                                        name="due"
                                        control={form.control}
                                        render={({ field: { onChange, value } }) => (
                                            <DatePicker
                                                className="h-[45px] w-[250px] border-[#0065D0CC] bg-[#C9F0FF] text-[#0065D0CC]"
                                                placeholder="Select Due Date"
                                                selected={value}
                                                onSelect={(date) => {
                                                    onChange(date);
                                                }}
                                                disabled={(date) => date < endOfYesterday()}
                                            />
                                        )}
                                    />
                                    <span className="absolute -bottom-5 flex w-full">
                                        {form.formState.errors.due?.message && (
                                            <span className="text-sm text-red-200">
                                                {form.formState.errors.due?.message}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex grow flex-col gap-6 p-6">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-medium text-black">Preferred Skills</h3>
                            <div className="flex items-center justify-start gap-2">
                                <div className="relative">
                                    <SkillInput {...form.register("firstSkill")} />
                                    <span className="absolute -bottom-6 flex w-full">
                                        {form.formState.errors.firstSkill?.message && (
                                            <span className="text-sm text-red-500">
                                                {form.formState.errors.firstSkill?.message}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="relative">
                                    <SkillInput {...form.register("secondSkill")} />
                                    <span className="absolute -bottom-6 flex w-full">
                                        {form.formState.errors.secondSkill?.message && (
                                            <span className="text-sm text-red-500">
                                                {form.formState.errors.secondSkill?.message}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="relative">
                                    <SkillInput {...form.register("thirdSkill")} />
                                    <span className="absolute -bottom-6 flex w-full">
                                        {form.formState.errors.thirdSkill?.message && (
                                            <span className="text-sm text-red-500">
                                                {form.formState.errors.thirdSkill?.message}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-medium text-black">Job Description</h3>
                            <div className="relative">
                                <textarea
                                    maxLength={400}
                                    id="description"
                                    {...form.register("description")}
                                    className="w-full rounded-lg border border-blue-300 bg-[#C9F0FF] p-4 focus:outline-none"
                                    placeholder="Enter job description"
                                    rows={3}
                                />
                                <div className="-mt-1 ml-auto w-fit text-sm text-body">
                                    {form.watch("description")?.length} / 400 characters
                                </div>
                                <span className="absolute -bottom-4 flex w-full">
                                    {form.formState.errors.description?.message && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.description?.message}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-medium text-black">Deliverables</h3>

                            <div className="relative">
                                <Controller
                                    name="deliverables"
                                    control={form.control}
                                    render={({ field: { onChange, value = [] } }) => (
                                        <DeliverablesInput deliverables={value} setDeliverables={onChange} />
                                    )}
                                />
                                <span className="absolute -bottom-6 flex w-full">
                                    {form.formState.errors.deliverables?.message && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.deliverables?.message}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-medium text-black">Classification</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-body">Job Category</label>
                                    <div className="relative">
                                        <Controller
                                            name="category"
                                            control={form.control}
                                            render={({ field: { onChange, value } }) => {
                                                return (
                                                    <Select defaultValue={value} onValueChange={onChange}>
                                                        <SelectTrigger className="h-10 w-[180px] rounded-lg bg-[#F2F4F5] text-base text-title">
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
                                                            {CATEGORY_OPTIONS.map(({ label, value }) => (
                                                                <SelectItem
                                                                    key={value}
                                                                    value={value}
                                                                    className="rounded py-2 hover:bg-[#ECFCE5]"
                                                                >
                                                                    {label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                );
                                            }}
                                        />
                                        <span className="absolute -bottom-5 flex w-full">
                                            {form.formState.errors.category?.message && (
                                                <span className="text-sm text-red-500">
                                                    {form.formState.errors.category?.message}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-body">Visibility</label>
                                    <div className="relative">
                                        <Controller
                                            name="visibility"
                                            control={form.control}
                                            render={({ field: { onChange, value } }) => {
                                                return (
                                                    <Select defaultValue={value} onValueChange={onChange}>
                                                        <SelectTrigger className="h-10 w-[180px] rounded-lg bg-[#F2F4F5] text-base text-title">
                                                            <SelectValue placeholder="Select Visibility" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem
                                                                value="private"
                                                                className="rounded py-2 hover:bg-[#ECFCE5]"
                                                            >
                                                                Private
                                                            </SelectItem>
                                                            <SelectItem
                                                                value="open"
                                                                className="rounded py-2 hover:bg-[#ECFCE5]"
                                                            >
                                                                Public
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                );
                                            }}
                                        />
                                        <span className="absolute -bottom-5 flex w-full">
                                            {form.formState.errors.visibility?.message && (
                                                <span className="whitespace-nowrap text-sm text-red-500">
                                                    {form.formState.errors.visibility?.message}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="flex shrink-0 grow-0 basis-[300px] flex-col gap-6 ">
                <div className="flex h-fit flex-col gap-3 rounded-xl border border-line bg-white p-6">
                    <h3 className="font-bold">Steps</h3>
                    <StepIndicator isComplete={jobSteps.details}>Job Details</StepIndicator>
                    <StepIndicator isComplete={jobSteps.skills}>Skills</StepIndicator>
                    <StepIndicator isComplete={jobSteps.description}>Description</StepIndicator>
                    <StepIndicator isComplete={jobSteps.deliverables}>Deliverables</StepIndicator>
                    <StepIndicator isComplete={jobSteps.classification}>Classifications</StepIndicator>
                    <StepIndicator isComplete={false}>Deposit Payment</StepIndicator>
                </div>

                <div className="flex w-full gap-4">
                    {!talentId && !job.escrowPaid && (
                        <div className="w-full">
                            <Button onClick={form.handleSubmit(onSubmit)} fullWidth>
                                {updateJob.isLoading ? <Spinner /> : "Update Job"}
                            </Button>
                        </div>
                    )}

                    {!talentId && job.escrowPaid && (
                        <div className="w-full">
                            <Button onClick={form.handleSubmit(onSubmit)} fullWidth>
                                {updateJob.isLoading ? <Spinner /> : "Update Job"}
                            </Button>
                        </div>
                    )}

                    {talentId && !job.escrowPaid && (
                        <div className="w-full">
                            <Button onClick={form.handleSubmit(onSubmit)} fullWidth>
                                {updateJob.isLoading ? <Spinner /> : "Make Deposit"}
                            </Button>
                        </div>
                    )}

                    {talentId && job.escrowPaid && (
                        <div className="w-full">
                            <Button onClick={form.handleSubmit(onSubmit)} fullWidth>
                                {inviteTalent.isLoading || updateJob.isLoading ? <Spinner /> : "Invite Talent"}
                            </Button>
                        </div>
                    )}
                </div>
                {/* <div className="bg-white p-6 rounded-xl min-h-[250px] border border-line flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Attachments</span>{' '}
            <span className="text-body text-sm font-normal">(optional)</span>
          </div>

          <div
            className="border border-dashed rounded-3xl p-4 text-center grow flex items-center justify-center hover:bg-gray-50 duration-200 cursor-pointer"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <span className="flex text-body">Click to browse or drag and drop your files</span>
          </div>
        </div> */}
            </div>
        </div>
    );
};

interface Props {
    params: {
        "job-id": string;
    };
}

export default function EditJob({ params }: Props): React.JSX.Element {
    const jobId = params["job-id"];
    const jobQuery = useGetJobById({ jobId });

    if (jobQuery.isError) return <PageError className="absolute inset-0" />;
    if (jobQuery.isLoading) return <PageLoading className="absolute inset-0" />;
    const { data: job } = jobQuery;

    return <JobEditForm job={job} />;
}
