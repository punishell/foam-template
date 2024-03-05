"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"h-auto inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:!cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
	{
		variants: {
			variant: {
				default:
					"bg-ink-darkest text-white hover:bg-opacity-60 dark:bg-ink-darkest dark:text-white dark:hover:bg-opacity-60",
				destructive: "bg-red-100 text-red-500",
				outline: "border border-white text-white hover:text-white dark:border-white dark:hover:text-white",
				secondary: "bg-[#ECFCE5] text-primary hover:bg-[#ECFCE5]/80 border-primary border",
				ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
				link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
				white: "bg-white text-slate-900 hover:bg-opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-opacity-60",
				primary: "bg-primary-gradient text-white hover:bg-opacity-60 dark:hover:bg-opacity-60",
			},
			size: {
				default: "h-10 px-5 py-3",
				xs: "h-6 px-2.5 py-1.5",
				sm: "h-9 rounded-[10px] px-4 py-2",
				lg: "h-12 rounded-[10px] px-8 py-2.5",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, fullWidth = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={`${cn(buttonVariants({ variant, size, className }))} ${fullWidth && "w-full"}`}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
