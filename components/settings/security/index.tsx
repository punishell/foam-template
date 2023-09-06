import { Button, Input, Text } from "pakt-ui";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Check } from "lucide-react";
import { AuthApp2FA } from "./auth-app";
import { Email2FA } from "./email-2fa";
import { SecurityQuestion2FA } from "./security-question-2fa";
import { useChangePassword } from "@/lib/api/account";
import { Spinner } from "@/components/common";
import { useMemo } from "react";


const spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current Password is required'),
  newPassword: z.string().min(1, 'New Password is required').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
  ),
  confirmNewPassword: z.string().min(1, 'Confirm New Password is required'),
})
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

type EditProfileFormValues = z.infer<typeof changePasswordFormSchema>;

export const SecurityView = () => {
  const changePassword = useChangePassword();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<EditProfileFormValues> = (values) => {
    return changePassword.mutate({ oldPassword: values.currentPassword, newPassword: values.newPassword }, {
      onSuccess: () => {
        form.reset({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        });
      }
    });
  };
  const validatingErr = useMemo(() => ({
    isMinLength: form.getValues().newPassword && form.getValues().newPassword.length >= 8 || false,
    checkLowerUpper: form.getValues().newPassword && /[A-Z]/.test(form.getValues().newPassword) && /[a-z]/.test(form.getValues().newPassword) || false,
    checkNumber: form.getValues().newPassword && form.getValues().newPassword.match(/\d+/g) ? true : false,
    specialCharacter: form.getValues().newPassword && spChars.test(form.getValues().newPassword) || false,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [form.watch("newPassword")]);

  return (
    <div className='flex flex-row relative gap-6 h-full grow overflow-auto pb-4'>
      <div className='flex flex-col w-1/4 h-fit bg-white rounded-lg'>
        <form className='flex flex-col gap-4 p-4'
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}>
          <h3 className="font-bold text-lg">Change Password</h3>
          <Input {...form.register('currentPassword')} type="password" className="w-full !bg-[#FCFCFD] !border-[#E8E8E8]" placeholder="enter current password" label='Current Password' />
          {form.formState.errors.currentPassword?.message && (
            <span className="text-sm text-red-500">{form.formState.errors.currentPassword?.message}</span>
          )}
          <Input {...form.register('newPassword')} type="password" className="w-full !bg-[#FCFCFD] !border-[#E8E8E8]" placeholder="enter new password" label='New Password' />
          <p className="text-body text-sm">Password must contain</p>
          <div className="flex flex-col p-4 text-body text-xs gap-4">
            <PasswordCriteria isValidated={validatingErr.isMinLength} criteria="At least 8 characters" />
            <PasswordCriteria isValidated={validatingErr.checkLowerUpper} criteria="Upper and lower case characters" />
            <PasswordCriteria isValidated={validatingErr.checkNumber} criteria="1 or mote numbers" />
            <PasswordCriteria isValidated={validatingErr.specialCharacter} criteria="1 or more special characters" />
          </div>
          <Input {...form.register('confirmNewPassword')} type="password" className="w-full !bg-[#FCFCFD] !border-[#E8E8E8]" placeholder="re-enter new password" label='Confirm New Password' />
          {form.formState.errors.confirmNewPassword?.message && (
            <span className="text-sm text-red-500">{form.formState.errors.confirmNewPassword?.message}</span>
          )}
          <Button title='Save Changes' variant={"secondary"} size="sm" type="submit" className="min-w-[136px]" disabled={!form.formState.isValid || changePassword.isLoading}>{changePassword.isLoading ? <Spinner /> : "Save Changes"}</Button>
        </form>
      </div>
      <div className="flex h-fit w-3/4 flex-col gap-6 rounded-lg bg-white p-6 ">
        <Text.h3 size="xs">2FA</Text.h3>

        <div className="flex justify-between gap-5">
          <AuthApp2FA isEnabled={false} />
          <Email2FA isEnabled={false} />
          <SecurityQuestion2FA isEnabled={false} />
        </div>
      </div>
    </div>
  )
};

const PasswordCriteria: React.FC<{
  isValidated: boolean;
  criteria: string;
}> = ({ isValidated, criteria }) => {
  return (
    <div className={`flex flex-row gap-4 items-center ${isValidated ? "text-success" : "text-body"}`}>
      <Check size={15} />
      {criteria}
    </div>
  );
};
