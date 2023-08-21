import { axios } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';

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
}

async function postSignUp({ email, password, firstName, lastName }: SignupParams): Promise<SignupResponse> {
  const res = await axios.post('/auth/create-account', {
    email,
    password,
    lastName,
    firstName,
  });
  return res.data.data;
}

export function useSignUp() {
  return useMutation({ mutationFn: postSignUp, mutationKey: ['signup'] });
}

// Verify Email

interface VerifyEmailResponse {
  token: string;
  expiresIn: number;
}

interface VerifyEmailParams {
  otp: string;
  signUpToken: string;
}

async function postVerifyEmail({ otp, signUpToken }: VerifyEmailParams): Promise<VerifyEmailResponse> {
  const res = await axios.post('/auth/account/verify', { otp, signUpToken });
  return res.data.data;
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: postVerifyEmail,
    mutationKey: ['verify-email'],
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
  });
}

// Login

interface LoginResponse {
  email: string;
  token: string;
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
  return useMutation({
    mutationFn: postLogin,
    mutationKey: ['login'],
  });
}
