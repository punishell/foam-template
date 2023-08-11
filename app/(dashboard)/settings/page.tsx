'use client'
import React, { useState } from 'react';
import * as z from 'zod';
import { Tabs } from '@/components/common/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UserAvatar2 } from '@/components/common/user-avatar';
import { ChevronDown, ChevronUp, InfoIcon, Mail, MapPin, Verified } from 'lucide-react';
import { Button, Checkbox, Input, Select, Switch, Textarea } from 'pakt-ui';

const ProfileStates = [
  { label: "Private", value: "private" },
  { label: "Public", value: "public" }
];

const editProfileFormSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  jobTitle: z.string().min(1, 'Job Title is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  bio: z.string().min(1, 'Bio is required'),
  location: z.string().min(1, 'Location is required'),
  country: z.string().min(1, 'Country is required'),
});

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

// TODO:: Move to components
const ProfileView = () => {
  const [isPrivate, setIsPrivate] = useState("public");
  const [showDelete, setShowDelete] = useState(false);
  const [acceptedDelete, setAcceptedDelete] = useState(false);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileFormSchema),
  });

  const onSubmit: SubmitHandler<EditProfileFormValues> = (values) => {
    console.log("values===>", values);
  };

  return (
    <div className='flex flex-row relative gap-6 h-full grow overflow-auto pb-4'>
      <div className='flex flex-col w-1/5 h-fit bg-white rounded-lg items-center drop-shadow-md shadow-md'>
        <div className='flex flex-col gap-4 border-b-2 p-4'>
          <div className='flex justify-end min-h-[27px]'>
            <span className='bg-success-lighter text-success py-2 px-4 rounded-xl text-xs font-thin capitalize'>{isPrivate}</span>
          </div>
          <div className='flex justify-center item-center mx-auto text-center'>
            <UserAvatar2 />
          </div>
          <div className='flex flex-row justify-center items-center'>
            <p className='text-lg font-bold text-title'>Aliya Blackwood</p>
            <Verified className='ml-2' />
          </div>
          <div className='flex flex-row justify-center items-center text-body'>
            <Mail className='mr-2' />
            <p className='text-base font-thin text-body'>janecooper@pakt.world</p>
          </div>
          <div className='flex flex-row justify-center items-center text-body'>
            <MapPin className='mr-2' />
            <p className='text-base font-thin text-body'>Lagos Nigeria</p>
          </div>
          <div className='flex flex-col mt-4'>
            <Select label='Profile Visibility' options={ProfileStates} onChange={(e: any) => setIsPrivate(e)} placeholder={isPrivate} className='!bg-[#FCFCFD] !border-[#E8E8E8] capitalize' />
            <p className='text-sm my-4 text-body'>Your visibility settings determine if your profile is searchable.</p>
          </div>
        </div>
        <div className='flex flex-row w-full justify-between p-4'>
          <p className='text-title font-thin'>Deactivate Account</p>
          <Switch />
        </div>
      </div>
      <div className='flex flex-col w-4/5 overflow-y-auto h-full'>
        <div className='bg-white rounded-lg p-4 shadow-md mb-4'>
          <div className='flex flex-row justify-between h-[50px] items-center mb-4'>
            <p className='text-lg text-title font-bold'>Edit Profile Details</p>
            <Button title='Save Changes' variant={"secondary"} size="xs">Save Changes</Button>
          </div>
          <div className='flex'>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex relative w-full mx-auto gap-6 flex-col">
              <div id="input-row" className='flex flex-row justify-between gap-4 w-full'>
                <Input {...form.register('firstName')} className="w-1/2 !bg-[#FCFCFD] !border-[#E8E8E8]" placeholder="enter first name" label='First Name' />
                <Input {...form.register('lastName')} className="w-1/2 !bg-[#FCFCFD] !border-[#E8E8E8]" placeholder="enter last name" label='Last Name' />
              </div>
              <div id="input-row" className='flex flex-row justify-between gap-4 w-full'>
                <Input {...form.register('jobTitle')} className="w-1/2 !bg-[#FCFCFD] !border-[#E8E8E8]" placeholder="e.g Developer" label='Job Title' />
                <Input {...form.register('email')} className="w-1/2 !bg-[#FCFCFD] !border-[#E8E8E8]" placeholder="Email Address" label='Email Address' />
              </div>
              <div id="input-row" className='flex flex-row justify-between gap-4 w-full'>
                <div className='w-1/2 h-full gap-4'>
                  <Textarea
                    {...form.register('jobTitle')}
                    className='!h-[120px] !bg-[#FCFCFD] !border-[#E8E8E8]'
                    placeholder='enter short bio'
                    label='Bio'
                    maxLength={120}
                    rows={3}
                  />
                  <p className='flex flex-row text-sm text-body justify-end'>{form.getValues()?.bio?.length || 0}/120</p>
                </div>
                <div className='flex flex-col gap-4 w-1/2'>
                  <Input {...form.register('location')} className="w-full !bg-[#FCFCFD] !border-[#E8E8E8]" placeholder="enter location" label='Location' />
                  <Input {...form.register('country')} className="w-full !bg-[#FCFCFD] !border-[#E8E8E8]" placeholder="enter country" label='Country' />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className='bg-white rounded-lg p-4 drop-shadow-md shadow-md mb-4'>
          <div className='flex flex-row justify-between h-[50px] items-center'>
            <p className='text-lg text-title font-bold'>Professional Information</p>
            <Button title='Save Changes' variant={"secondary"} size="xs">Save Changes</Button>
          </div>
          <div className='flex flex-col gap-4'>
            <p>Skill Sets</p>
            <div className='flex flex-row gap-4'>
              <div className='w-1/2'>
                <p className='text-body text-sm'>Add your top 3 skills first</p>
                <Textarea
                  className='!min-h-[186px]'
                  placeholder='Enter a 350 character about thing'
                />
              </div>
              <div className='w-1/2'>
                <p className='text-body text-sm'>About</p>
                <Textarea
                  className='!min-h-[186px] w-full'
                  placeholder='Enter a 350 character about thing'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-lg p-4 drop-shadow-md shadow-md mb-8'>
          <div className='flex flex-row justify-between h-[50px] items-center'>
            <p className='text-lg text-title font-bold'>Delete Account</p>
            {showDelete ? <ChevronUp className='cursor-pointer' onClick={() => setShowDelete(!showDelete)} /> :
              <ChevronDown className='cursor-pointer' onClick={() => setShowDelete(!showDelete)} />}
          </div>
          {showDelete && <div className='flex flex-col gap-4 my-4'>
            <div className='flex flex-row gap-4 bg-yellow p-4 rounded-lg'>
              <InfoIcon size={40} />
              <div>
                <p className='text-title text-base font-bold'>You’re Deleting Your Account</p>
                <p className='text-title text-sm font-thin leading-5'>
                  Deleting your account will permanently remove all data associated with it, including projects, APIs, and analytics. This action cannot be undone. Please make sure you have downloaded any necessary data or backups before proceeding with account deletion.
                </p>
              </div>
            </div>
            <div className='flex flex-row justify-between items-center gap-4'>
              <div className='flex items-center gap-4'>
                <Checkbox title='I confirm my account deletion' checked={acceptedDelete} onCheckedChange={() => setAcceptedDelete(!acceptedDelete)} />
                I confirm my account deletion
              </div>
              <Button variant="danger" size="md" disabled={!acceptedDelete}>Delete</Button>
            </div>
          </div>}
        </div>
      </div>
    </div>
  )
};

const NotificationTypes = [
  { label: "Account Activity", email: true, browser: true },
  { label: "New Browser Sign in", email: true, browser: true },
  { label: "Withdrawals", email: true, browser: true },
  { label: "Deposits", email: true, browser: true },
  { label: "Payments", email: true, browser: true },
];
// TODO::  Move to components
const NotificationView = () => {
  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-col bg-white rounded-lg p-4 pb-20 gap-4'>
        <h2 className='text-lg font-bold'>Set Notification Preferences</h2>
        <p className='text-body text-sm'>We need permissions to show notifications</p>
        <div className='flex flex-col'>
          <div className='flex flex-row text-sm text-body p-4'>
            <p className='flex-initial w-4/6'>Type</p>
            <p className='flex-initial w-1/6'>Email</p>
            <p className='flex-initial w-1/6'>Browser</p>
          </div>
          {NotificationTypes.map((n, i) =>
            <div key={i} className={ i%2 == 0 ? 'flex flex-row text-base text-title p-8 bg-preference': 'flex flex-row text-sm text-title p-8'}>
              <p className='flex-initial w-4/6'>{n.label}</p>
              <div className='flex-initial w-1/6'>
                <Checkbox checked={n.email} />
              </div>
              <div className='flex-initial w-1/6'>
                <Checkbox checked={n.browser} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


export default function Settings() {
  return (
    <div className="flex flex-col gap-8 relative h-full">
      <div className="flex flex-col justify-between">
        <div className="text-3xl text-title font-bold">Settings</div>
      </div>
      <Tabs
        tabs={[
          { label: 'Profile', value: 'profile', content: <ProfileView /> },
          { label: 'Security', value: 'security', content: <div>Ongoing</div> },
          { label: 'Notification', value: 'notification', content: <NotificationView /> },
        ]}
      />
    </div>
  );
}
