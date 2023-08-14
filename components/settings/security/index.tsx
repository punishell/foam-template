import { Button, Input, Text } from "pakt-ui";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Check } from "lucide-react";
import Image from "next/image";
import { AuthApp2FA } from "./auth-app";
import { Email2FA } from "./email-2fa";
import { SecurityQuestion2FA } from "./security-question-2fa";


const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current Password is required'),
  newPassword: z.string().min(1, 'New Password is required'),
  confirmNewPassword: z.string().min(1, 'Confirm New Password is required'),
});

type EditProfileFormValues = z.infer<typeof changePasswordFormSchema>;

export const SecurityView = () => {

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  return (
    <div className='flex flex-row relative gap-6 h-full grow overflow-auto pb-4'>
      <div className='flex flex-col w-1/4 h-fit bg-white rounded-lg'>
        <div className='flex flex-col gap-4 p-4'>
          <h3 className="font-bold text-lg">Change Password</h3>
          <Input {...form.register('currentPassword')} className="w-full !bg-[#FCFCFD] !border-[#E8E8E8]" placeholder="enter current password" label='Current Password' />
          <Input {...form.register('newPassword')} className="w-full !bg-[#FCFCFD] !border-[#E8E8E8]" placeholder="enter new password" label='New Password' />
          <p className="text-body text-sm">Password must contain</p>
          <div className="flex flex-col p-4 text-body text-xs gap-4">
            <div className="flex flex-row gap-4 items-center"><Check size={15} /> At least 8 characters</div>
            <div className="flex flex-row gap-4 items-center"><Check size={15} />  Upper and lower case characters</div>
            <div className="flex flex-row gap-4 items-center"><Check size={15} />  1 or mote numbers</div>
            <div className="flex flex-row gap-4 items-center"><Check size={15} />  1 or more special characters</div>
          </div>
          <Input {...form.register('confirmNewPassword')} className="w-full !bg-[#FCFCFD] !border-[#E8E8E8]" placeholder="re-enter new password" label='Confirm New Password' />
          <Button title='Save Changes' variant={"secondary"} size="xs">Save Changes</Button>
        </div>
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