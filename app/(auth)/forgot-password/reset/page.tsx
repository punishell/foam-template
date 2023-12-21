'use client';
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Lottie from 'lottie-react';
import { Timer } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import {
  Button,
  Input,
} from 'pakt-ui';
import {
  Controller,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import ReactOTPInput from 'react-otp-input';
import * as z from 'zod';

import { Spinner } from '@/components/common';
import { Container } from '@/components/common/container';
import { PasswordCriteria } from '@/components/settings/security';
import {
  useRequestPasswordReset,
  useResetPassword,
  useVerifyResetPassword,
} from '@/lib/api';
import {
  formatCountdown,
  spChars,
} from '@/lib/utils';
import success from '@/lottiefiles/success.json';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  otp: z.string().min(6, { message: 'OTP is required' }),
});

type FormValues = z.infer<typeof formSchema>;

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[0-9]/, 'Password must contain at least one number.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.');

const resetFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

type ResetFormValues = z.infer<typeof resetFormSchema>;

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showResetForm, setShowResetForm] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const email = searchParams.get('email') ?? "";
  const token = searchParams.get('token') ?? "";

  useEffect(() => {
    if (typeof email !== 'string' || typeof token !== 'string' || email == "" || token == "") {
      return router.push('/forgot-password');
    }
  }, [email, token]);

  return showResetForm ? <ResetPasswordForm searchParams={searchParams} otp={otp} token={token} /> : <ResetPasswordVerify searchParams={searchParams} email={email} token={token} setShowResetForm={() => setShowResetForm(true)} setOtp={setOtp} />
}

function ResetPasswordVerify({ setShowResetForm, setOtp, searchParams, email, token }: { setShowResetForm: () => void; setOtp: (otp: string) => void, searchParams: ReadonlyURLSearchParams, email: string, token: string }) {
  const [countdown, setCountdown] = React.useState(0);
  const [isResendDisabled, setIsResendDisabled] = React.useState(true);
  const requestPasswordReset = useRequestPasswordReset();

  const router = useRouter();
  const verifyResetPassword = useVerifyResetPassword();

  React.useEffect(() => {
    if (isResendDisabled) {
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
      setTimeout(() => setIsResendDisabled(false), 60000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isResendDisabled]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = ({ otp }) => {
    // const email = searchParams.get('email');
    // const token = searchParams.get('token');

    if (typeof email !== 'string' || typeof token !== 'string') {
      return router.push('/login');
    }

    // verifyResetPassword.mutate(
    //   {
    //     token: otp,
    //     tempToken: token,
    //   },
    //   {
    //     onSuccess: () => {
    setOtp(otp);
    setShowResetForm();
    //       return;
    //     },
    //   },
    // );
  };

  const handleResendOTP = () => {
    const email = searchParams.get('email');

    if (typeof email !== 'string') {
      return router.push('/login');
    }

    requestPasswordReset.mutate(
      {
        email,
      },
      {
        onSuccess: () => {
          setIsResendDisabled(true);
        },
      },
    );
  };

  return (
    <div>
      <Container className="flex items-center justify-between mt-16">
        <Link className="max-w-[200px]" href="/">
          <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
        </Link>
      </Container>

      <Container className="mt-28 flex w-full max-w-2xl flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center text-white">
          <h3 className="font-sans text-3xl font-bold">Reset Password Code</h3>
          <p className="font-sans text-base">
            A code has been sent to your email address. Enter it to verify your reset password.
          </p>
        </div>
        <form
          className="flex relative z-[100] w-full mx-auto max-w-[600px] flex-col bg-[rgba(0,124,91,0.20)] backdrop-blur-md items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0, 124, 91, 0.20)] px-[40px] py-10 backdrop-blur-lg"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-fit gap-4">
            <Controller
              name="otp"
              control={form.control}
              render={({ field: { onChange, value } }) => {
                return (
                  <ReactOTPInput
                    value={value}
                    onChange={onChange}
                    shouldAutoFocus={true}
                    numInputs={6}
                    containerStyle="gap-3 flex"
                    inputStyle={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '4px',
                      border: '1px solid #D0DDD5',
                    }}
                    renderInput={(props) => (
                      <input
                        {...props}
                        className="w-full rounded-md px-3 !select-none py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    )}
                  />
                );
              }}
            />

            <Button fullWidth disabled={verifyResetPassword.isLoading || !form.formState.isValid}>
              {verifyResetPassword.isLoading ? <Spinner /> : 'Reset Password'}
            </Button>

            <div className="flex flex-col gap-4 items-center w-full">
              <span className="text-white">{formatCountdown(countdown)}</span>
              <div className="w-full max-w-[150px]">
                <Button
                  size="xs"
                  fullWidth
                  variant="outline"
                  onClick={!(requestPasswordReset.isLoading || isResendDisabled) ? handleResendOTP : () => { }}
                  disabled={requestPasswordReset.isLoading || isResendDisabled}
                  className="!border-white !text-white"
                  style={{ opacity: requestPasswordReset.isLoading || isResendDisabled ? 0.2 : 1 }}
                >
                  <span className="flex flex-row gap-2">
                    <Timer size={16} className="text-white" />
                    {requestPasswordReset.isLoading ? <Spinner size={16} /> : 'Resend Code'}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}


function ResetPasswordForm({ otp, token }: { searchParams: ReadonlyURLSearchParams, otp: string, token: string }) {
  const changePassword = useResetPassword();
  const [isCompleted, _setIsCompleted] = useState(false);
  const loading = changePassword.isLoading;
  const router = useRouter();

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
  });

  const onSubmit: SubmitHandler<ResetFormValues> = (values) => {
    console.log(values);
    changePassword.mutate(
      { tempToken: token, token: otp, password: values.password },
      {
        onSuccess: () => {
        },
      },
    );
  };

  const validatingErr = useMemo(() => ({
    isMinLength: resetForm.getValues().password && resetForm.getValues().password.length >= 8 || false,
    checkLowerUpper: resetForm.getValues().password && /[A-Z]/.test(resetForm.getValues().password) && /[a-z]/.test(resetForm.getValues().password) || false,
    checkNumber: resetForm.getValues().password && resetForm.getValues().password.match(/\d+/g) ? true : false,
    specialCharacter: resetForm.getValues().password && spChars.test(resetForm.getValues().password) || false,
    confirmedPassword: resetForm.getValues().password === resetForm.getValues().confirmPassword && resetForm.getValues().password != "",
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [resetForm.watch("password"), resetForm.watch("confirmPassword")]);

  console.log(resetForm.formState.errors)

  return (
    <React.Fragment>
      <Container className="flex items-center justify-between mt-16">
        <div className="max-w-[200px]">
          <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
        </div>

        {!loading && (
          <Link
            className="rounded-lg border-2 bg-white !bg-opacity-10 px-5 py-2 text-white duration-200 hover:bg-opacity-30"
            href="/login"
          >
            Login
          </Link>
        )}
      </Container>
      {!isCompleted && (
        <Container className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center text-white">
            <h3 className="font-sans text-3xl font-bold">Reset Password</h3>
            <p className="font-sans text-base">Choose a new password for your account</p>
          </div>
          <form
            onSubmit={resetForm.handleSubmit(onSubmit)}
            className="flex relative z-[100] w-full mx-auto max-w-[600px] flex-col bg-[rgba(0,124,91,0.20)] backdrop-blur-md items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0, 124, 91, 0.20)] px-[40px] py-10 backdrop-blur-lg"
          >
            <div className="flex gap-4 flex-col w-full">
              <div className="flex flex-col gap-2 relative mb-2">
                <label htmlFor="password" className="text-white text-sm">
                  Create Password
                </label>
                <Input
                  id="password"
                  {...resetForm.register('password')}
                  className=""
                  placeholder="create password"
                  type="password"
                />
                <div className="flex flex-col p-4 text-body text-xs gap-4">
                  <PasswordCriteria isValidated={validatingErr.isMinLength} criteria="At least 8 characters" isSignUp={true} />
                  <PasswordCriteria isValidated={validatingErr.checkLowerUpper} criteria="Upper and lower case characters" isSignUp={true} />
                  <PasswordCriteria isValidated={validatingErr.checkNumber} criteria="1 or mote numbers" isSignUp={true} />
                  <PasswordCriteria isValidated={validatingErr.specialCharacter} criteria="1 or more special characters" isSignUp={true} />
                  <PasswordCriteria isValidated={validatingErr.confirmedPassword} criteria="passwords must be match" isSignUp={true} />
                </div>
              </div>

              <div className="flex flex-col gap-2 relative mb-2">
                <label htmlFor="confirmPassword" className="text-white text-sm">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  {...resetForm.register('confirmPassword')}
                  className=""
                  placeholder="re-type password"
                  type="password"
                />
              </div>
            </div>

            <Button className="" fullWidth disabled={!resetForm.formState.isValid || changePassword.isLoading}>
              {changePassword.isLoading ? <Spinner /> : 'Reset Password'}
            </Button>
          </form>
        </Container>
      )}
      {isCompleted && (
        <Container className="mt-28 text-white text-center flex w-full max-w-xl flex-col items-center gap-2 justify-center p-8 rounded-2xl mx-auto  bg-[rgba(0,124,91,0.20)] backdrop-blur-md border border-white border-opacity-20 bg-[rgba(0, 124, 91, 0.20)] px-[40px] py-10 backdrop-blur-lg">
          <div className="max-w-[150px] w-full flex items-center justify-center">
            <Lottie animationData={success} />
          </div>
          <h6 className="text-lg font-thin flex-wrap opacity-[0.8] my-4">Password Reset Successful.</h6>
          <Button className="" fullWidth onClick={() => router.push("/login")}>Login</Button>
        </Container>
      )}
    </React.Fragment>
  );
}