/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as z from "zod";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character.");

export const otpSchema = z.object({
    otp: z.string().min(6, { message: "OTP is required" }),
});

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email("Please enter a valid email address."),
});

export const resetPasswordSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match.",
    });

export const loginSchema = z.object({
    password: z.string().min(1, "Password is required").min(8, "Password is too short"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
});

export const signupSchema = z
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
