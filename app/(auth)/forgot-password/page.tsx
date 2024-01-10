"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "pakt-ui";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/common";
import { Container } from "@/components/common/container";
import { useRequestPasswordReset } from "@/lib/api";
import { createQueryStrings } from "@/lib/utils";

const formSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email("Please enter a valid email address."),
});

type FormValues = z.infer<typeof formSchema>;

export default function ConfirmEmail(): React.JSX.Element {
    const router = useRouter();
    const requestPasswordReset = useRequestPasswordReset();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        requestPasswordReset.mutate(values, {
            onSuccess: (data) => {
                router.push(
                    `/forgot-password/reset?${createQueryStrings([
                        {
                            name: "email",
                            value: values.email,
                        },
                        {
                            name: "token",
                            value: data.tempToken.token,
                        },
                    ])}`,
                );
            },
        });
    };

    return (
        <div>
            <Container className="mt-16 flex items-center justify-between">
                <Link className="max-w-[200px]" href="/">
                    <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
                </Link>
            </Container>

            <Container className="mt-28 flex w-full max-w-2xl flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2 text-center text-white">
                    <h3 className="font-sans text-3xl font-bold">Forgot Password</h3>
                    <p className="max-w-md font-sans text-base">
                        Enter the email you used to create your account so we can send you instructions on how to reset
                        your password.
                    </p>
                </div>
                <form
                    className="bg-[rgba(0, 124, 91, 0.20)] relative z-[100] mx-auto flex w-full max-w-[600px] flex-col items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0,124,91,0.20)] px-[40px] py-10 backdrop-blur-lg backdrop-blur-md"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="relative flex w-full flex-col gap-2">
                        <label className="font-sans text-sm text-white" htmlFor="email">
                            Email
                        </label>
                        <Input
                            {...form.register("email")}
                            placeholder="Email"
                            type="email"
                            className="w-full"
                            id="email"
                        />
                    </div>

                    <Button fullWidth disabled={!form.formState.isValid || requestPasswordReset.isLoading}>
                        {requestPasswordReset.isLoading ? <Spinner /> : "Send Reset Link"}
                    </Button>

                    <Link href="/login" className="mt-4 font-sans text-sm text-white">
                        Back to login
                    </Link>
                </form>
            </Container>
        </div>
    );
}
