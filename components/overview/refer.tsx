import React, { useState } from 'react';
import { SideModal } from '../common/side-modal';
import { Calendar, ChevronLeft, CopyIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from 'pakt-ui';
import { UserAvatar } from '../common/user-avatar';

import email from '@/lottiefiles/email.json';
import Lottie from 'lottie-react';
import { TagInput } from '../common/tag-input';


interface ReferralModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const recentReferrals = [
  { name: "Mary Monroe", score: 74, title: "Product Designer", image: '', dated: '22/05/2023' },
  { name: "Mary Monroe", score: 74, title: "Product Designer", image: '', dated: '22/05/2023' },
  { name: "Mary Monroe", score: 74, title: "Product Designer", image: '', dated: '22/05/2023' },
]

const referralSchema = z.object({
  emails: z.array(z.string()).nonempty({ message: "emails are required" }),
});

type LoginFormValues = z.infer<typeof referralSchema>;

export function ReferralSideModal({ isOpen, onOpenChange }: ReferralModalProps) {
  const [isSentEmail, setIsSentEmail] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(referralSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (values) => {
    setIsSentEmail(true);
    form.resetField("emails");
  };

  return (
    <SideModal isOpen={isOpen} onOpenChange={onOpenChange} className="flex flex-col">
      <div className="flex flex-row p-6 bg-primary-gradient text-white font-bold text-2xl gap-4">
        <ChevronLeft size={32} className='cursor-pointer' onClick={() => isSentEmail ? setIsSentEmail(false) : onOpenChange(false)} /> Refer User
      </div>
      {!isSentEmail ?
        <div className='flex flex-col p-6 gap-2'>
          <h3 className='text-2xl font-semibold'>Invite your friends, increase your Afroscore</h3>
          <p className='text-base'>You can invite up to 3 people per week.</p>
          <div className='my-4 w-full rounded-2xl p-4 bg-primary-brighter border border-primary-darker'>
            <h3 className='text-lg font-bold'>Email Invite</h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full relative my-4'>
              <div className='border p-1 bg-input-bg rounded-2xl'>
                <Controller
                  name="emails"
                  control={form.control}
                  render={({ field: { onChange, value = [] } }) => (
                    <TagInput tags={value} setTags={onChange} className="items-start border border-none" placeholder="Send invite email to friends" />
                  )}
                />
              </div>
              <div className='flex w-full mt-4 mr-0 '>
                {/* <div className='absolute -right-1 w-32 bottom-0'> */}
                <Button className='min-h-[50px]' variant={"primary"} disabled={!form.formState.isValid} fullWidth>Send</Button>
              </div>
              {/* <p className='text-sm text-body'>Use commas(,) to separate emails</p> */}
            </form>
          </div>
          <div className='relative w-full'>
            <div className='-z-10 absolute top-2 w-full border' />
            <div className='mx-auto bg-white text-center text-body w-24 z-20 font-bold'>OR</div>
          </div>
          <div className='my-4'>
            <h3 className='text-lg font-bold'>Referral Link</h3>
            <div className='w-full relative my-4'>
              <div className='my-auto min-h-[51px] p-4 text-sm items-center rounded-xl border'>{"https://afro.fund/ref/kyuopf"}</div>
              <div className='absolute -right-1 top-0 h-full'>
                <Button size="sm" className='min-h-full text-sm items-center !border-primary-darker' variant={"secondary"}>
                  <span className='flex flex-row gap-2'>
                    <CopyIcon size={15} /> Copy
                  </span>
                </Button>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className='text-2xl font-bold'>Recently Referred</h3>
            <p className='text-base font-thin'>Your referrals that joined the Platform</p>
            <div className='flex flex-col gap-2 my-4'>
              {recentReferrals.map((r, i) => <div key={i} className='bg-refer-bg flex flex-row justify-between w-full py-2 px-4 rounded-2xl border border-refer-border'>
                <div className='flex flex-row gap-2'>
                  <UserAvatar size='xs' image={r.image} score={r.score} />
                  <span className='items-center my-auto'>
                    <h3 className='text-lg text-title'>{r.name}</h3>
                    <p className='text-title text-sm'>{r.title}</p>
                  </span>
                </div>
                <div className='flex flex-row text-body gap-2 my-auto'><Calendar size={24} /> {r.dated}</div>
              </div>)}
            </div>
          </div>
        </div> :
        <div className='flex flex-col h-full p-10 text-center'>
          <Lottie animationData={email} loop={true} />
          <p className='text-body text-base mb-8'>Your Invite has been sent. You’ll be notified when a user signs up with your referral link</p>
          <div className='w-1/2 mx-auto'>
            <Button variant={"primary"} onClick={() => setIsSentEmail(false)} fullWidth>Done</Button>
          </div>
        </div>
      }
    </SideModal >
  )
}