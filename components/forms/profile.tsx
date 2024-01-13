"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import type * as z from "zod";
import { Controller, type SubmitHandler, type UseFormReturn } from "react-hook-form";
import { Button, Input } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "../common";
import { useUpdateAccount } from "@/lib/api/account";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/common/select";
import countryJson from "@/lib/country.json";
import { type editProfileFormSchema } from "@/lib/validations";
import ProfessionalInfo from "../settings/profile/professional-info";
import DeleteAccount from "../settings/profile/delete-account";

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

interface FormProps {
    form: UseFormReturn<EditProfileFormValues>;
    updateAccountFunc: (values: EditProfileFormValues) => void;
}

const ProfileForm = ({ form, updateAccountFunc }: FormProps): ReactElement => {
    const COUNTRY_LIST: Array<{ label: string; value: string }> = (countryJson || []).map((c) => ({
        label: c.name,
        value: c.name,
    }));

    const updateAccount = useUpdateAccount();

    const loading = updateAccount.isLoading || form.formState.isLoading;

    const onSubmit: SubmitHandler<EditProfileFormValues> = (values) => {
        updateAccountFunc(values);
    };

    return (
        <form className="flex min-h-full w-4/5 flex-col overflow-y-auto" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4 rounded-lg bg-white p-4">
                <div className="mb-4 flex h-[50px] flex-row items-center justify-between">
                    <p className="text-lg font-bold text-title">Edit Profile Details</p>
                    <Button
                        title="Save Changes"
                        variant="secondary"
                        size="xs"
                        type="submit"
                        className="min-h-[37px] min-w-[132px]"
                    >
                        {loading ? <Spinner size={18} /> : "Save Changes"}
                    </Button>
                </div>
                <div className="flex">
                    <div className="relative mx-auto mb-8 flex w-full flex-col gap-6">
                        <div id="input-row" className="flex w-full flex-row justify-between gap-4">
                            <div className="relative w-1/2">
                                <Input
                                    {...form.register("firstName")}
                                    className="w-full !border-[#E8E8E8] !bg-[#FCFCFD]"
                                    placeholder="enter first name"
                                    label="First Name"
                                />
                                <span className="absolute -bottom-6 flex w-full">
                                    {form.formState.errors.firstName?.message && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.firstName?.message}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="relative w-1/2">
                                <Input
                                    {...form.register("lastName")}
                                    className="w-full !border-[#E8E8E8] !bg-[#FCFCFD]"
                                    placeholder="enter last name"
                                    label="Last Name"
                                />
                                <span className="absolute -bottom-6 flex w-full">
                                    {form.formState.errors.lastName?.message && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.lastName?.message}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                        <div id="input-row" className="flex w-full flex-row justify-between gap-4">
                            <div className="relative w-1/2">
                                <Input
                                    {...form.register("title")}
                                    className="w-full !border-[#E8E8E8] !bg-[#FCFCFD]"
                                    placeholder="e.g Developer"
                                    label="Job Title"
                                />
                                <span className="absolute -bottom-6 flex w-full">
                                    {form.formState.errors.title?.message && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.title?.message}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="relative w-1/2">
                                <Input
                                    {...form.register("email")}
                                    className="w-full !border-[#E8E8E8] !bg-[#FCFCFD]"
                                    placeholder="Email Address"
                                    label="Email Address"
                                    readOnly
                                />
                                <span className="absolute -bottom-6 flex w-full">
                                    {form.formState.errors.email?.message && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.email?.message}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                        <div id="input-row" className="flex w-full flex-row justify-between gap-4">
                            <div className="relative w-1/2">
                                <Input
                                    {...form.register("location")}
                                    className="w-full !border-[#E8E8E8] !bg-[#FCFCFD]"
                                    placeholder="Enter city"
                                    label="City"
                                />
                                <span className="absolute -bottom-6 flex w-full">
                                    {form.formState.errors.location?.message && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.location?.message}
                                        </span>
                                    )}
                                </span>
                            </div>

                            <div className="relative w-1/2">
                                <Controller
                                    name="country"
                                    control={form.control}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <div className="flex w-full flex-col gap-2">
                                                <label> Country</label>
                                                <Select defaultValue={value} onValueChange={onChange}>
                                                    <SelectTrigger className="text-bas e h-[48px] w-full rounded-lg !border-[#E8E8E8] !bg-[#FCFCFD] text-title">
                                                        <SelectValue placeholder="Select Country" />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-[200px] overflow-y-auto">
                                                        {COUNTRY_LIST.map(({ label, value: v }) => (
                                                            <SelectItem
                                                                key={v}
                                                                value={v}
                                                                className="rounded py-2 hover:bg-[#ECFCE5]"
                                                            >
                                                                {label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        );
                                    }}
                                />
                                <span className="absolute -bottom-6 flex w-full">
                                    {form.formState.errors.country?.message && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.country?.message}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ProfessionalInfo form={form} />
            <DeleteAccount />
        </form>
    );
};

export default ProfileForm;
