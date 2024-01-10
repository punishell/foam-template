"use client";

import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Input, Button, PasswordInput } from "pakt-ui";
import { setCookie } from "cookies-next";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Container } from "@/components/common/container";
import { createQueryStrings, AUTH_TOKEN_KEY } from "@/lib/utils";
import { useLogin } from "@/lib/api";
import { Spinner } from "@/components/common";
import { useUserState } from "@/lib/store/account";

const loginFormSchema = z.object({
    password: z.string().min(1, "Password is required").min(8, "Password is too short"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function Login(): React.JSX.Element {
    const login = useLogin();
    const router = useRouter();
    const { setUser } = useUserState();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
    });

    const onSubmit: SubmitHandler<LoginFormValues> = (values) => {
        login.mutate(values, {
            onSuccess: (data) => {
                if (!data.isVerified) {
                    router.push(
                        `/signup/verify?${createQueryStrings([
                            { name: "email", value: data.email },
                            { name: "token", value: data.tempToken?.token ?? "" },
                            { name: "verifyType", value: "email" },
                        ])}`,
                    );
                    return;
                }
                if (data.twoFa?.status) {
                    router.push(
                        `/login/verify?${createQueryStrings([
                            { name: "token", value: data.tempToken?.token ?? "" },
                            { name: "verifyType", value: "2fa" },
                            { name: "type", value: data.twoFa.type },
                        ])}`,
                    );
                    return;
                }
                setUser(data);
                setCookie(AUTH_TOKEN_KEY, data.token);
                router.push("/overview");
            },
        });
    };

    return (
        <div>
            <Container className="mt-16 flex items-center justify-between">
                <div className="max-w-[200px]">
                    <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
                </div>
            </Container>

            <Container className="mt-28 flex w-full max-w-2xl flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2 text-center text-white">
                    <h3 className="font-sans text-3xl font-bold">Login to your account</h3>
                    <p className="font-sans text-base">Connecting African Talent to Global Opportunity</p>
                </div>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mx-auto flex w-full max-w-[600px] flex-col items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-primary bg-opacity-20 px-[40px] py-10 backdrop-blur-md"
                >
                    <div className="flex w-full flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm text-white">
                                Email Address
                            </label>

                            <Input {...form.register("email")} className="" placeholder="Email Address" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm text-white">
                                Password
                            </label>
                            <PasswordInput {...form.register("password")} className="" placeholder="Password" />
                        </div>

                        <div className="flex items-center justify-end">
                            <Link href="/forgot-password" className="text-sm text-white">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <Button fullWidth disabled={!form.formState.isValid || login.isLoading}>
                        {login.isLoading ? <Spinner /> : "Login"}
                    </Button>
                </form>
            </Container>
        </div>
    );
}
