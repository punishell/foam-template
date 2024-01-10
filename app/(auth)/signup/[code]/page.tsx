"use client";

import { useEffect, useMemo, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input, Button } from "pakt-ui";
import Lottie from "lottie-react";

import { Container } from "@/components/common/container";
import { useValidateReferral } from "@/lib/api/referral";
import { InputErrorMessage, Spinner } from "@/components/common";
import { createQueryStrings, spChars } from "@/lib/utils";
import { useSignUp } from "@/lib/api";
import warning from "@/lottiefiles/warning-2.json";
import { PasswordCriteria } from "@/components/settings/security";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character.");

const formSchema = z
    .object({
        lastName: z.string().min(1, { message: "Name is required" }),
        firstName: z.string().min(1, { message: "Name is required" }),
        email: z.string().min(1, { message: "Email is required" }).email("Please enter a valid email address."),
        password: passwordSchema,
        confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match.",
    });

type FormValues = z.infer<typeof formSchema>;

export default function Signup(): React.JSX.Element {
    const signup = useSignUp();
    const validateRef = useValidateReferral();
    const router = useRouter();
    const params = useParams();
    const [isLoading, _setIsLoading] = useState(true);
    const [errorMsg, _setErrorMsg] = useState(false);
    const referralCode = String(params.code);

    const validateReferral = (): void => {
        if (referralCode === "") {
            // throw error
            _setErrorMsg(true);
            _setIsLoading(false);
        }
        // validate code here
        validateRef.mutate(
            { token: referralCode },
            {
                onSuccess: () => {
                    _setIsLoading(false);
                },
                onError: () => {
                    _setErrorMsg(true);
                    _setIsLoading(false);
                },
            },
        );
    };

    useEffect(() => {
        validateReferral();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        signup.mutate(
            { ...values, referral: referralCode },
            {
                onSuccess: ({ tempToken, email }) => {
                    router.push(
                        `/signup/verify?${createQueryStrings([
                            {
                                name: "email",
                                value: email,
                            },
                            {
                                name: "token",
                                value: tempToken.token,
                            },
                        ])}`,
                    );
                },
            },
        );
    };

    const { password } = form.getValues();
    const { confirmPassword } = form.getValues();

    const passwordWatch = form.watch("password");
    const confirmPasswordWatch = form.watch("confirmPassword");

    const validatingErr = useMemo(
        () => ({
            isMinLength: password?.length >= 8 || false,
            checkLowerUpper: (/[A-Z]/.test(password) && /[a-z]/.test(password)) || false,
            checkNumber: !(password?.match(/\d+/g) == null),
            specialCharacter: spChars.test(password) || false,
            confirmedPassword:
                (password === confirmPassword && password !== "" && password !== undefined && password !== null) ||
                false,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [passwordWatch, confirmPasswordWatch],
    );

    return (
        <>
            <Container className="mt-16 flex items-center justify-between">
                <div className="max-w-[200px]">
                    <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
                </div>

                {!isLoading && (
                    <Link
                        className="rounded-lg border-2 bg-white !bg-opacity-10 px-5 py-2 text-white duration-200 hover:bg-opacity-30"
                        href="/login"
                    >
                        Login
                    </Link>
                )}
            </Container>
            {!isLoading && !errorMsg && (
                <Container className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-2 text-center text-white">
                        <h3 className="font-sans text-3xl font-bold">Create Your Account</h3>
                        {/* <p className="font-sans text-base">Create Your Account</p> */}
                    </div>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="bg-[rgba(0, 124, 91, 0.20)] relative z-[100] mx-auto flex w-full max-w-[600px] flex-col items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0,124,91,0.20)] px-[40px] py-10 backdrop-blur-lg backdrop-blur-md"
                    >
                        <div className="flex w-full flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative mb-2 flex flex-col gap-2">
                                    <label htmlFor="firstName" className="text-sm text-white">
                                        First Name
                                    </label>
                                    <Input id="firstName" {...form.register("firstName")} placeholder="First Name" />
                                    <InputErrorMessage message={form.formState.errors.firstName?.message} />
                                </div>
                                <div className="relative flex flex-col gap-2">
                                    <label htmlFor="lastName" className="text-sm text-white">
                                        Last Name
                                    </label>
                                    <Input id="lastName" {...form.register("lastName")} placeholder="Last Name" />
                                    <InputErrorMessage message={form.formState.errors.lastName?.message} />
                                </div>
                            </div>

                            <div className="relative mb-2 flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm text-white">
                                    Email Address
                                </label>
                                <Input id="email" {...form.register("email")} placeholder="Email Address" />
                                <InputErrorMessage message={form.formState.errors.email?.message} />
                            </div>

                            <div className="relative mb-2 flex flex-col gap-2">
                                <label htmlFor="password" className="text-sm text-white">
                                    Create Password
                                </label>
                                <Input
                                    id="password"
                                    {...form.register("password")}
                                    className=""
                                    placeholder="Password"
                                    type="password"
                                />
                                <div className="flex flex-col gap-4 p-4 text-xs text-body">
                                    <PasswordCriteria
                                        isValidated={validatingErr.isMinLength}
                                        criteria="At least 8 characters"
                                        isSignUp
                                    />
                                    <PasswordCriteria
                                        isValidated={validatingErr.checkLowerUpper}
                                        criteria="Upper and lower case characters"
                                        isSignUp
                                    />
                                    <PasswordCriteria
                                        isValidated={validatingErr.checkNumber}
                                        criteria="1 or more numbers"
                                        isSignUp
                                    />
                                    <PasswordCriteria
                                        isValidated={validatingErr.specialCharacter}
                                        criteria="1 or more special characters"
                                        isSignUp
                                    />
                                    <PasswordCriteria
                                        isValidated={validatingErr.confirmedPassword}
                                        criteria="passwords must be match"
                                        isSignUp
                                    />
                                </div>
                            </div>

                            <div className="relative mb-2 flex flex-col gap-2">
                                <label htmlFor="confirmPassword" className="text-sm text-white">
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    {...form.register("confirmPassword")}
                                    className=""
                                    placeholder="Confirm Password"
                                    type="password"
                                />
                            </div>
                        </div>

                        <Button className="" fullWidth disabled={!form.formState.isValid || signup.isLoading}>
                            {signup.isLoading ? <Spinner /> : "Signup"}
                        </Button>
                    </form>
                </Container>
            )}
            {isLoading && (
                <div className="flex h-full justify-center text-white">
                    <Spinner />
                </div>
            )}
            {!isLoading && errorMsg && (
                <Container className="bg-[rgba(0, 124, 91, 0.20)] mx-auto mt-28 flex w-full max-w-xl flex-col items-center justify-center gap-2  rounded-2xl border border-white border-opacity-20 bg-[rgba(0,124,91,0.20)] p-8 px-[40px] py-10 text-center text-white backdrop-blur-lg backdrop-blur-md">
                    <div className="flex w-full max-w-[150px] items-center justify-center">
                        <Lottie animationData={warning} />
                    </div>
                    <h3 className="text-3xl font-bold">Invalid Referral Code</h3>
                    <h6 className="flex-wrap text-lg font-thin opacity-[0.8]">
                        You need a valid referral code to be able to sign up to Afrofund.{" "}
                    </h6>
                </Container>
            )}
        </>
    );
}
