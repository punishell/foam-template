'use client'
import React, { useState } from 'react';
import { Tabs } from '@/components/common/tabs';
import { UserAvatar2 } from '@/components/common/user-avatar';
import { Mail, MapPin, Verified } from 'lucide-react';
import { Select, Switch } from 'pakt-ui';

const ProfileStates = [
  { label: "Private", value: "private" },
  { label: "Public", value: "public" }
]

const ProfileView = () => {
  const [isPrivate, setIsPrivate] = useState("public");
  return (
    <div className='flex flex-row gap-6 mt-2'>
      <div className='w-1/4 bg-white min-h-[478px] rounded-lg items-center'>
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
            {/* <p className='text-tile text-sm'>Profile Visibility</p> */}
            <Select label='Profile Visibility' options={ProfileStates} onChange={(e: any) => setIsPrivate(e)} placeholder={isPrivate} />
            <p className='text-sm my-4 text-body'>Your visibility settings determine if your profile is searchable.</p>
          </div>
        </div>
        <div className='flex flex-row justify-between p-4'>
          <p className='text-title font-thin'>Deactivate Account</p>
          <Switch />
        </div>
      </div>
      <div className='w-3/4 bg-white min-h-[478px] rounded-lg'>
        Second Part
      </div>
    </div>
  )
};

export default function Settings() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between">
        <div className="text-3xl text-title font-bold">Settings</div>
      </div>

      <div className="gap-6 flex flex-col">
        <div className='flex flex-col'>
          <Tabs
            tabs={[
              { label: 'Profile', value: 'profile', content: <ProfileView /> },
              { label: 'Security', value: 'security', content: <div>Ongoing</div> },
              { label: 'Notification', value: 'notification', content: <div>Completed</div> },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
