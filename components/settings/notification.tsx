import React from 'react';
import { Checkbox } from 'pakt-ui';


const NotificationTypes = [
  { label: "Account Activity", email: true, browser: true },
  { label: "New Browser Sign in", email: true, browser: true },
  { label: "Withdrawals", email: true, browser: true },
  { label: "Deposits", email: true, browser: true },
  { label: "Payments", email: true, browser: true },
];

export const NotificationView = () => {
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
};
