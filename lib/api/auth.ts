import { axios, ApiError } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/common/toaster';
import { useUserState } from '../store/account';

// Signup

interface SignupResponse {
  email: string;
  tempToken: {
    token: string;
    expiresIn: number;
  };
}

interface SignupParams {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  referral: string;
}

async function postSignUp({ email, password, firstName, lastName, referral }: SignupParams): Promise<SignupResponse> {
  const res = await axios.post('/auth/create-account', {
    email,
    password,
    lastName,
    firstName,
    referral
  });
  return res.data.data;
}

export function useSignUp() {
  return useMutation({
    mutationFn: postSignUp,
    mutationKey: ['signup'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}

// Verify Email

interface VerifyEmailResponse {
  token: string;
  expiresIn: number;
}

interface VerifyEmailParams {
  otp: string;
  token: string;
}

async function postVerifyEmail({ otp, token }: VerifyEmailParams): Promise<VerifyEmailResponse> {
  const res = await axios.post('/auth/account/verify', { token: otp, tempToken: token });
  return res.data.data;
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: postVerifyEmail,
    mutationKey: ['verify-email'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}

// Resend OTP

interface ResendOTPResponse {
  token: string;
  expiresIn: number;
}

interface ResendOTPParams {
  email: string;
}

async function postResendOTP({ email }: ResendOTPParams): Promise<ResendOTPResponse> {
  const res = await axios.post('/auth/verify/resend', { email });
  return res.data.data;
}

export function useResendOTP() {
  return useMutation({
    mutationFn: postResendOTP,
    mutationKey: ['resend-otp'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: () => {
      toast.success('OTP sent successfully');
    },
  });
}

// Login

interface LoginResponse {
  email: string;
  token: string;
  isVerified: boolean;
  tempToken?: {
    token: string;
  };
}

interface LoginParams {
  email: string;
  password: string;
}

async function postLogin({ email, password }: LoginParams): Promise<LoginResponse> {
  const res = await axios.post('/auth/login', { email, password });
  return res.data.data;
}

export function useLogin() {
  const { setUser } = useUserState();
  return useMutation({
    mutationFn: postLogin,
    mutationKey: ['login'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (data) => {
      // @ts-ignore
      setUser(data);
    },
  });
}

// reset Password

interface ResetPasswordParams {
  email: string;
}

interface ResetPasswordResponse {
  message: string;
}

async function postRequestPasswordReset({ email }: ResetPasswordParams): Promise<ResetPasswordResponse> {
  const res = await axios.post('/auth/password/reset', { email });
  return res.data.data;
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: postRequestPasswordReset,
    mutationKey: ['request-reset-password'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}
