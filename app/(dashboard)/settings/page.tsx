'use client'
import React from 'react';
import { Tabs } from '@/components/common/tabs';
import { ProfileView } from '@/components/settings/profile';
import { NotificationView } from '@/components/settings/notification';
import { SecurityView } from '@/components/settings/security';

export default function Settings() {
  return (
    <div className="flex flex-col gap-8 relative h-full">
      <div className="flex flex-col justify-between">
        <div className="text-3xl text-title font-bold">Settings</div>
      </div>
      <Tabs
        tabs={[
          { label: 'Profile', value: 'profile', content: <ProfileView /> },
          { label: 'Security', value: 'security', content: <SecurityView /> },
          { label: 'Notification', value: 'notification', content: <NotificationView /> },
        ]}
      />
    </div>
  );
}