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
          <div className='flex flex-row text-sm text-body py-4 px-8'>
            <p className='flex-1 w-64'>Type</p>
            <p className='flex-initial w-32 text-right'>EMAIL</p>
            <p className='flex-initial w-32 text-right'>BROWSER</p>
          </div>
          {NotificationTypes.map((n, i) =>
            <div key={i} className={`flex flex-row text-base text-title py-4 px-8 ${i % 2 == 0 ? "bg-preference" : ""}`}>
              <p className='flex-1 w-64'>{n.label}</p>
              <div className='flex-initial w-32 text-right'>
                <Checkbox checked={n.email} />
              </div>
              <div className='flex-initial w-32 text-right'>
                <Checkbox checked={n.browser} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};
