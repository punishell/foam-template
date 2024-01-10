"use client";

import { forwardRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "pakt-ui";
import { endOfYesterday, format } from "date-fns";
import * as z from "zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateJob } from "@/lib/api/job";
import { Spinner } from "@/components/common";
import { DollarIcon } from "@/components/common/icons";
import { DatePicker } from "@/components/common/date-picker";
import { NumericInput } from "@/components/common/numeric-input";
import { DeliverablesInput } from "@/components/jobs/deliverables-input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/common/select";
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

const SkillInput = forwardRef<HTMLInputElement, SkillInputProps>(({ ...props }, ref) => {
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

export default function CreateJob(): React.JSX.Element {
    const router = useRouter();
    const createJob = useCreateJob();
    // const { _id: userId } = useUserState();
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
        mode: "all",
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormValues> = ({
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
        createJob.mutate(
            {
                name: title,
                tags: [firstSkill, secondSkill, thirdSkill].filter(Boolean),
                category,
                description,
                deliverables,
                paymentFee: Number(budget),
                isPrivate: visibility === "private",
                deliveryDate: format(due, "yyyy-MM-dd"),
            },
            {
                onSuccess: ({ _id }) => {
                    router.push(`/jobs/${_id}`);
                },
            },
        );
    };

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
            form.watch("deliverables").filter((r) => r !== undefined && r !== "").length > 0 &&
            !form.getFieldState("deliverables").invalid,
        classification:
            form.watch("visibility") !== undefined &&
            !form.getFieldState("visibility").invalid &&
            form.watch("category") !== undefined &&
            !form.getFieldState("category").invalid,
    };

    return (
        <div className="flex h-full gap-6 overflow-y-auto pb-10">
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                    }
                }}
                className="flex h-fit grow flex-col rounded-2xl border bg-white"
            >
                <div className="flex flex-col gap-10 rounded-t-2xl bg-primary-gradient p-6 pb-8">
                    <div className="relative">
                        <input
                            type="text"
                            // autoFocus
                            maxLength={60}
                            {...form.register("title")}
                            placeholder="Enter Job Title"
                            className="w-full bg-transparent text-3xl text-white caret-white placeholder:text-white placeholder:text-opacity-60 focus:outline-none"
                        />
                        <div className="ml-auto text-right text-sm text-white">{form.watch("title")?.length}/ 60</div>
                        <span className="absolute -bottom-5 flex w-full">
                            {form.formState.errors.title?.message != null && (
                                <span className="text-sm text-red-200">{form.formState.errors.title?.message}!</span>
                            )}
                        </span>
                    </div>

                    <div className="flex max-w-lg gap-4">
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
                                {form.formState.errors.budget?.message != null && (
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
                                {form.formState.errors.due?.message != null && (
                                    <span className="text-sm text-red-200">{form.formState.errors.due?.message}</span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex grow flex-col gap-6 p-6">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-medium text-black">
                            Preferred Skills
                            <span className="ml-4 text-sm font-thin text-body">You can add up to three</span>
                        </h3>
                        <div className="flex items-center justify-start gap-2">
                            <div className="relative">
                                <SkillInput {...form.register("firstSkill")} />
                                <span className="absolute -bottom-6 left-2 flex w-full">
                                    {form.formState.errors.firstSkill?.message != null && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.firstSkill?.message}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <SkillInput {...form.register("secondSkill")} />
                                <span>
                                    {form.formState.errors.secondSkill?.message != null && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.secondSkill?.message}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="relative">
                                <SkillInput {...form.register("thirdSkill")} />
                                <span className="absolute bottom-2">
                                    {form.formState.errors.thirdSkill?.message != null && (
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
                                id="description"
                                maxLength={400}
                                {...form.register("description")}
                                className="w-full rounded-lg border border-blue-300 bg-[#C9F0FF] p-4 focus:outline-none"
                                placeholder="Enter job description"
                                rows={3}
                            />
                            <div className="-mt-1 ml-auto w-fit text-sm text-body">
                                {form.watch("description")?.length} / 400 characters
                            </div>
                            <span className="absolute -bottom-4 flex w-full">
                                {form.formState.errors.description?.message != null && (
                                    <span className="text-sm text-red-500">
                                        {form.formState.errors.description?.message}
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-medium text-black">
                            Deliverables{" "}
                            <span className="ml-4 text-sm font-thin text-body">
                                You can create up to five deliverables
                            </span>
                        </h3>

                        <div className="relative">
                            <Controller
                                name="deliverables"
                                control={form.control}
                                render={({ field: { onChange, value = [] } }) => (
                                    <DeliverablesInput deliverables={value} setDeliverables={onChange} />
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

                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-medium text-black">Classifications</h3>
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
                                        {form.formState.errors.category?.message != null && (
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
                                        {form.formState.errors.visibility?.message != null && (
                                            <span className="whitespace-nowrap text-sm text-red-500">
                                                {form.formState.errors.visibility?.message}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="ml-auto mt-auto w-full max-w-[250px] rounded-xl border border-gray-300">
                                <Button disabled={createJob.isLoading || !form.formState.isValid} fullWidth>
                                    {createJob.isLoading ? (
                                        <Spinner />
                                    ) : form.watch("visibility") === "private" ? (
                                        "Post Job"
                                    ) : (
                                        "Post Job"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div className="flex shrink-0 grow-0 basis-[300px] flex-col gap-6">
                <div className="flex h-fit flex-col gap-3 rounded-xl border border-line bg-white p-6">
                    <h3 className="font-bold">Steps</h3>
                    <StepIndicator isComplete={jobSteps.details}>Job Details</StepIndicator>
                    <StepIndicator isComplete={jobSteps.skills}>Skills</StepIndicator>
                    <StepIndicator isComplete={jobSteps.description}>Description</StepIndicator>
                    <StepIndicator isComplete={jobSteps.deliverables}>Deliverables</StepIndicator>
                    <StepIndicator isComplete={jobSteps.classification}>Classifications</StepIndicator>
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
}
