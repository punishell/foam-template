/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { SendHorizonal, Paperclip } from 'lucide-react';
import { MessageTypeEnums, useMessaging } from '@/providers/socketProvider';
import { Spinner } from '@/components/common';

interface Props {
  params: {
    'message-id': string;
  };
}

export default function Chat({ params }: Props) {
  const { 'message-id': messageId } = params;
  const [loadingMessage, setLoadingMessages] = useState(true);
  const [text, setText] = useState("");
  const { currentConversation, loadingChats, setActiveConversation, sendUserMessage } = useMessaging();

  const loadMessages = async () => {
    await setActiveConversation(messageId);
    setLoadingMessages(false);
  }

  const messages = useMemo(() => currentConversation?.messages || [], [currentConversation?.messages]);

  useEffect(() => {
    if (!loadingChats) loadMessages()
  }, [loadingChats]);

  const scrollMessages = () => {
    setTimeout(() => {
      const objDiv = document.getElementById("chat_div");
      if (objDiv) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => { scrollMessages() }, [currentConversation?.messages]);

  if (loadingMessage) return <LoadingMessages />;

  const sendMessage = async () => {
    console.log("Send message...", text, currentConversation);
    await sendUserMessage(currentConversation?.recipient?._id, currentConversation?.sender?._id, MessageTypeEnums.TEXT, text, currentConversation.id);
    setText("");
  }

  return (
    <div className='flex flex-col h-full'>
      <ChatBoxHeader title={currentConversation?.header?.title} description={currentConversation?.header?.description} time={currentConversation?.createdAt} />
      <div className="grow w-full overflow-y-auto">
        {messages.length == 0 ? <NoMessages /> : <Messages messages={messages} />}
      </div>
      <div className="flex flex-col gap-0 border rounded-lg w-full bg-gray-50">
        <textarea
          rows={3}
          className="grow border-b focus:outline-none p-2 resize-none rounded-t-lg w-full bg-gray-50"
          placeholder="Write your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-between items-center w-full gap-2 p-2">
          <button className="border h-8 w-8 bg-[#008D6C1A] text-primary rounded-full flex items-center justify-center">
            <Paperclip size={16} />
          </button>
          <button className="border h-8 w-8 bg-primary-gradient rounded-full text-white flex items-center justify-center" onClick={sendMessage}>
            <SendHorizonal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const ChatBoxHeader = ({ title, description, time }: { title: string, description: string, time: string }) => {
  return (
    <div className="flex gap-2 justify-between items-center border-b pb-3 border-line mb-3">
      <div className="flex gap-2 items-center">
        <div className="h-[50px] flex w-[50px] bg-black rounded-full"></div>
        <div className="flex flex-col gap-1">
          <div className="text-title text-lg leading-none font-medium">{title}</div>
          <div className="text-body text-sm leading-none">{description}</div>
        </div>
      </div>
      <div>
        <span className="text-body">Started: {time}</span>
      </div>
    </div>
  );
};

const NoMessages = () => {
  return (
    <div className="h-full w-full grow flex items-center flex-col gap-1 justify-center">
      <div className="text-slate-300 text-2xl">No messages yet</div>
    </div>
  );
};

const LoadingMessages = () => (
  <div className="h-full w-full grow flex items-center flex-col gap-1 justify-center">
    <Spinner />
  </div>
);

const Messages = ({ messages }: { messages: [] }) => {
  return (
    <div id="chat_div" className="flex flex-col gap-2 h-full overflow-y-auto py-6">
      {messages.map((message: any, i) =>
        <div className="w-full" key={i}>
          {!message.isSent ?
            <div className="mr-auto w-fit max-w-[600px] bg-[#ECFCE5] px-5 py-2 text-title rounded-r-[30px] rounded-tl-[30px]">{message.content}</div> :
            <div className="ml-auto w-fit max-w-[600px] text-white px-5 py-2 bg-[#007C5B] rounded-l-[30px] rounded-tr-[30px]">{message.content}</div>}
        </div>
      )}
    </div>
  );
};
