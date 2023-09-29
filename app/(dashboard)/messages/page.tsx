'use client'
import React, { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useMessaging } from '@/providers/socketProvider';
import { PageLoading } from '@/components/common/page-loading';

export default function Messages() {
  const { startUserInitializeConversation, startingNewChat } = useMessaging();
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams(searchParams as any);
  const userId = queryParams.get('userId');
  const initialized = useRef(false)

  useEffect(() => {
    if (userId && !initialized.current) {
      initialized.current = true;
      startUserInitializeConversation(userId);
    }
  }, [userId]);

  if (startingNewChat) return <PageLoading />

  return (
    <div className="bg-white h-full w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-body text-center">
        <MessageCircle size={120} className="text-slate-400" />
        <span>Send private messages to a client or talent</span>
      </div>
    </div>
  );
}
