'use client';
import React from 'react';
import * as z from 'zod';
import { useSignUp } from '@/lib/api';
import { setCookie } from 'cookies-next';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/common';
import Link from 'next/link';
import Image from 'next/image';
import { useLogin } from '@/lib/api';
import { Input, Button } from 'pakt-ui';
import { Container } from '@/components/common/container';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[0-9]/, 'Password must contain at least one number.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.');

const formSchema = z
  .object({
    lastName: z.string().min(1, { message: 'Name is required' }),
    firstName: z.string().min(1, { message: 'Name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email('Please enter a valid email address.'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

type FormValues = z.infer<typeof formSchema>;

export default function Signup() {
  const signup = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    signup.mutate(values, {
      onSuccess: (data) => {
        // setCookie("jwt", data.token);
        router.push(searchParams.get('from') || '/overview');
      },
    });
  };

  return (
    <React.Fragment>
      <div>
        <Container className="flex items-center justify-between mt-16">
          <div className="max-w-[200px]">
            <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
          </div>

          <Link
            className="rounded-lg border-2 bg-white !bg-opacity-10 px-5 py-2 text-white duration-200 hover:bg-opacity-30"
            href="/login"
          >
            Login
          </Link>
        </Container>

        <Container className="mt-28 flex w-full max-w-2xl flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center text-white">
            <h3 className="font-sans text-3xl font-bold">Create Your Account</h3>
            <p className="font-sans text-base">Create Your Account</p>
          </div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex relative z-[100] w-full mx-auto max-w-[600px] flex-col bg-[rgba(0,124,91,0.20)] backdrop-blur-md items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0, 124, 91, 0.20)] px-[40px] py-10 backdrop-blur-lg"
          >
            <div className="flex gap-4 flex-col w-full">
              <div className="grid gap-4 grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-white text-sm">
                    First Name
                  </label>
                  <Input id="firstName" {...form.register('firstName')} placeholder="First Name" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-white text-sm">
                    Last Name
                  </label>
                  <Input id="lastName" {...form.register('lastName')} placeholder="Last Name" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-white text-sm">
                  Email Address
                </label>
                <Input id="email" {...form.register('email')} placeholder="Email Address" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-white text-sm">
                  Create Password
                </label>
                <Input
                  id="password"
                  {...form.register('password')}
                  className=""
                  placeholder="Password"
                  type="password"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-white text-sm">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  {...form.register('confirmPassword')}
                  className=""
                  placeholder="Confirm Password"
                  type="password"
                />
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
              disabled={!form.formState.isValid || signup.isLoading}
            >
              {signup.isLoading ? <Spinner /> : 'Signup'}
            </Button>
          </form>
        </Container>
      </div>
    </React.Fragment>
  );
}
