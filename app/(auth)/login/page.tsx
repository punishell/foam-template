'use client';
import * as z from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { useLogin } from '@/lib/api';
import { Input, Button } from 'pakt-ui';
import { setCookie } from 'cookies-next';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Container } from '@/components/common/container';
import { useSearchParams, useRouter } from 'next/navigation';

import { Spinner } from '@/components/common';

const loginFormSchema = z.object({
  password: z.string().min(1, 'Password is required').min(8, 'Password is too short'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function Login() {
  const login = useLogin();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (values) => {
    login.mutate(values, {
      onSuccess: (data) => {
        setCookie('jwt', data.token);
        router.push(searchParams.get('from') || '/overview');
      },
    });
  };

  return (
    <div>
      <Container className="flex items-center justify-between mt-16">
        <div className="max-w-[200px]">
          <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
        </div>

        <Link
          className="rounded-lg border-2 bg-white !bg-opacity-10 px-5 py-2 text-white duration-200 hover:bg-opacity-30"
          href="/signup"
        >
          Signup
        </Link>
      </Container>

      <Container className="mt-28 flex w-full max-w-2xl flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center text-white">
          <h3 className="font-sans text-3xl font-bold">Login to your account</h3>
          <p className="font-sans text-base">Connecting African Talent to Global Opportunity</p>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex relative z-[100] w-full mx-auto max-w-[600px] flex-col bg-[rgba(0,124,91,0.20)] backdrop-blur-md items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0, 124, 91, 0.20)] px-[40px] py-10 backdrop-blur-lg"
        >
          <div className="flex gap-4 flex-col w-full">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-white text-sm">
                Email Address
              </label>

              <Input {...form.register('email')} className="" placeholder="Email Address" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-white text-sm">
                Password
              </label>
              <Input {...form.register('password')} className="" placeholder="Password" type="password" />
            </div>

            <div className="items-center justify-end flex">
              <Link href="/forgot-password" className="text-white text-sm">
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant={'primary'}
            className=""
            fullWidth
            disabled={!form.formState.isValid || login.isLoading}
          >
            {login.isLoading ? <Spinner /> : 'Login'}
          </Button>
        </form>
      </Container>
    </div>
  );
}
