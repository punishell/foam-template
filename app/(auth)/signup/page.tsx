'use client';
import * as z from 'zod';
import { useSignUp } from '@/lib/api';
import { setCookie } from 'cookies-next';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[0-9]/, 'Password must contain at least one number.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.');

const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    signup.mutate(values, {
      onSuccess: (data) => {
        // setCookie("jwt", data.token);
        router.push('/home');
      },
    });
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-2 w-fit">
          <input {...form.register('email')} className="border" />
          <input {...form.register('password')} className="border" />
          <input {...form.register('confirmPassword')} className="border" />
        </div>
        <button type="submit" className="bg-green-400 p-1">
          {signup.isLoading ? 'Loading...' : 'Signup'}
        </button>
      </form>
    </div>
  );
}
