import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function Messages() {
  return (
    <div className="bg-white h-full w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-body text-center">
        <MessageCircle size={120} className="text-slate-400" />
        <span>Send private messages to a client or talent</span>
      </div>
    </div>
  );
}
