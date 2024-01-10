"use client";
import React, { useMemo, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { UploadAvatar } from "@/components/common/upload-avatar";
import { ChevronDown, ChevronUp, InfoIcon, Mail, MapPin, Verified } from "lucide-react";
import { Button, Checkbox, Input, Select as SelectMain, Textarea } from "pakt-ui";
import { useGetAccount, useUpdateAccount } from "@/lib/api/account";
import { Spinner } from "../common";
import { TagInput } from "../common/tag-input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/common/select";
import countryJson from "@/lib/country.json";

const ProfileStates = [
    { label: "Private", value: "true" },
    { label: "Public", value: "false" },
];

const editProfileFormSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    title: z.string().min(1, "Job Title is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    bio: z.string().min(1, "Bio is required"),
    location: z.string().min(1, "Location is required"),
    country: z.string().min(1, "Country is required"),
    tags: z.array(z.string()).nonempty({ message: "skills are required" }),
    isPrivate: z.boolean().default(false).optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

export const ProfileView = () => {
    const [showDelete, setShowDelete] = useState(false);
    const [acceptedDelete, setAcceptedDelete] = useState(false);
    const { data: userAccount, refetch: refetchUser, isFetched, isLoading: accountIsLoading } = useGetAccount();
    const updateAccount = useUpdateAccount();
    const COUNTRY_LIST: { label: string; value: string }[] = (countryJson || []).map((c) => ({
        label: c.name,
        value: c.name,
    }));

    const userData = useMemo(
        () => ({
            ...userAccount,
            firstName: userAccount?.firstName,
            lastName: userAccount?.lastName,
            title: userAccount?.profile?.bio?.title,
            bio: userAccount?.profile?.bio?.description,
            location: userAccount?.profile?.contact?.city,
            country: userAccount?.profile?.contact?.country,
            avatar: userAccount?.profileImage?.url,
            kycVerified: false,
            tags: userAccount?.profile?.talent?.tags || [],
            isPrivate: userAccount?.isPrivate || false,
        }),
        [userAccount],
    );

    const form = useForm<EditProfileFormValues>({
        resolver: zodResolver(editProfileFormSchema),
        defaultValues: userData,
    });

    const updateAccountFunc = (values: EditProfileFormValues) => {
        const payload = {
            firstName: values.firstName,
            lastName: values.lastName,
            profile: {
                contact: {
                    state: values.location,
                    city: values.location,
                    country: values.country,
                },
                bio: {
                    title: values.title,
                    description: values.bio,
                },
                talent: {
                    tags: [...(values.tags || [])],
                },
            },
        };
        updateAccount.mutate(
            { ...payload },
            {
                onSuccess: (data) => {
                    refetchUser();
                },
            },
        );
    };

    const loading = updateAccount.isLoading || form.formState.isLoading;

    const toggleUserProfile = (state: string) => {
        const validState = state == "true";
        form.setValue("isPrivate", validState);
        return updateAccountFunc({ ...form.getValues(), isPrivate: validState });
    };

    const onSubmit: SubmitHandler<EditProfileFormValues> = (values) => {
        return updateAccountFunc(values);
    };

    if (accountIsLoading) return <Spinner />;

    return (
        <div className="relative flex h-full grow flex-row gap-6 overflow-y-auto">
            <div className="flex h-fit w-1/4 flex-col items-center rounded-lg bg-white">
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex min-h-[27px] justify-end">
                        <span className="rounded-xl bg-success-lighter px-4 py-2 text-xs font-thin capitalize text-success">
                            {form.getValues().isPrivate ? "Private" : "Public"}
                        </span>
                    </div>
                    <div className="item-center mx-auto flex flex-col justify-center gap-2 text-center">
                        <UploadAvatar size={150} image={userData.avatar} onUploadComplete={refetchUser} />
                    </div>
                    <div className="flex flex-row items-center justify-center">
                        <p className="text-lg font-bold text-title">
                            {userData?.firstName} {userData?.lastName}
                        </p>
                        {userData?.kycVerified && <Verified className="ml-2" />}
                    </div>
                    <div className="flex flex-row items-center justify-center text-body">
                        <Mail className="mr-2" />
                        <p className="text-base font-thin text-body">{userData?.email}</p>
                    </div>
                    <div className="flex flex-row items-center justify-center text-body">
                        <MapPin className="mr-2" />
                        <p className="text-base font-thin text-body">
                            {userData?.location}, {userData?.country}
                        </p>
                    </div>
                    <div className="mt-4 flex flex-col">
                        <SelectMain
                            label="Profile Visibility"
                            options={ProfileStates}
                            onChange={(e: any) => toggleUserProfile(e)}
                            placeholder={form.getValues().isPrivate ? "Private" : "Public"}
                            className="!border-[#E8E8E8] !bg-[#FCFCFD] capitalize"
                        />
                        {/* <Select defaultValue={form.getValues().isPrivate ? 'Private' : 'Public'} onValueChange={(e: any) => toggleUserProfile(e)} className="!bg-[#FCFCFD] !border-[#E8E8E8] capitalize">
                  <SelectTrigger className="w-[180px] bg-[#F2F4F5] text-title text-base h-10 rounded-lg">
                    <SelectValue placeholder="Profile Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {ProfileStates.map(({ label, value }) => (
                      <SelectItem key={value} value={value} className="hover:bg-[#ECFCE5] rounded py-2">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                        <p className="my-4 text-sm text-body">
                            Your visibility settings determine if your profile is searchable.
                        </p>
                    </div>
                </div>
                {/* <div className='flex flex-row w-full border-t-2 justify-between p-4'>
            <p className='text-title font-thin'>Deactivate Account</p>
            <Switch />
          </div> */}
            </div>
            <form className="flex min-h-full w-4/5 flex-col overflow-y-auto" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-4 rounded-lg bg-white p-4">
                    <div className="mb-4 flex h-[50px] flex-row items-center justify-between">
                        <p className="text-lg font-bold text-title">Edit Profile Details</p>
                        <Button
                            title="Save Changes"
                            variant={"secondary"}
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
                                                        <SelectTrigger className="h-10 h-[48px] w-full rounded-lg !border-[#E8E8E8] !bg-[#FCFCFD] text-base text-title">
                                                            <SelectValue placeholder="Select Country" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-[200px] overflow-y-auto">
                                                            {COUNTRY_LIST.map(({ label, value }) => (
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
                <div className="mb-4 rounded-lg bg-white p-4">
                    <div className="flex h-[50px] flex-row items-center justify-between">
                        <p className="text-lg font-bold text-title">Professional Information</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-4">
                            <div className="relative w-1/2">
                                <p className="text-sm">Skill Sets</p>
                                <div className="min-h-[186px] rounded-lg border border-primary border-opacity-40 !bg-[#FCFCFD]">
                                    <Controller
                                        name="tags"
                                        control={form.control}
                                        render={({ field: { onChange, value = [] } }) => (
                                            <TagInput
                                                tags={value}
                                                setTags={onChange}
                                                className="grow items-start border-none bg-transparent"
                                                placeholder="Add your top 3 skills first"
                                            />
                                        )}
                                    />
                                </div>
                                <span className="absolute -bottom-6 flex w-full">
                                    {form.formState.errors.tags?.message && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.tags?.message}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="relative w-1/2">
                                <p className="text-sm">Bio</p>
                                <Textarea
                                    maxLength={350}
                                    className="!min-h-[186px] w-full !bg-[#FCFCFD]"
                                    {...form.register("bio")}
                                    placeholder="Enter a 350 character about thing"
                                />
                                <div className="ml-auto w-fit text-sm text-body">
                                    {form.watch("bio")?.length ?? 0} / 350
                                </div>

                                <span className="absolute -bottom-6 flex w-full">
                                    {form.formState.errors.bio?.message && (
                                        <span className="text-sm text-red-500">
                                            {form.formState.errors.bio?.message}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-8 rounded-lg bg-white p-4">
                    <div
                        className="flex h-[50px] cursor-pointer flex-row items-center justify-between"
                        onClick={() => setShowDelete(!showDelete)}
                    >
                        <p className="text-lg font-bold text-title">Delete Account</p>
                        {showDelete ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    {showDelete && (
                        <div className="my-4 flex flex-col gap-4">
                            <div className="flex flex-row gap-4 rounded-lg bg-yellow p-4">
                                <InfoIcon size={40} />
                                <div>
                                    <p className="text-base font-bold text-title">You’re Deleting Your Account</p>
                                    <p className="text-sm font-thin leading-5 text-title">
                                        Deleting your account will permanently remove all data associated with it,
                                        including projects, APIs, and analytics. This action cannot be undone. Please
                                        make sure you have downloaded any necessary data or backups before proceeding
                                        with account deletion.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Checkbox
                                        title="I confirm my account deletion"
                                        checked={acceptedDelete}
                                        onCheckedChange={() => setAcceptedDelete(!acceptedDelete)}
                                    />
                                    I confirm my account deletion
                                </div>
                                <Button variant="danger" size="md" disabled={!acceptedDelete}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};
