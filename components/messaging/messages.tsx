"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderAttachmentViewer } from "@/components/messaging/single-attachment-view";
import { type AttachmentProps } from "@/components/messaging/types";

interface Message {
    isSent?: boolean;
    attachments: AttachmentProps[];
    content?: string;
}

interface MessagesProps {
    messages: Message[];
}

export const Messages = ({ messages }: MessagesProps): ReactElement => {
    return (
        <>
            {messages.length > 0 && (
                <div id="chat_div" className="flex h-full basis-0 flex-col overflow-y-auto py-6">
                    {messages.map((message, i) => (
                        <div className="w-full" key={i}>
                            {!message.isSent ? (
                                <div className="mr-auto flex w-fit max-w-[600px] flex-col gap-2 px-5">
                                    <RenderAttachmentViewer images={message.attachments} align="right" />
                                    {message.content && (
                                        <div className="mr-auto w-fit max-w-[600px] whitespace-pre-line break-words rounded-r-[30px] rounded-tl-[30px] bg-[#ECFCE5] px-5 py-2 text-title">
                                            {message.content}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="ml-auto flex w-fit max-w-[600px] flex-col gap-2 px-5">
                                    <RenderAttachmentViewer images={message.attachments} align="left" />
                                    {message.content && (
                                        <div className="ml-auto w-fit max-w-[600px] whitespace-pre-line break-words rounded-l-[30px] rounded-tr-[30px] bg-[#007C5B] px-5  py-2 text-white">
                                            {message.content}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {messages.length === 0 && (
                <div className="flex h-full w-full grow flex-col items-center justify-center gap-1">
                    <div className="text-2xl text-slate-300">No messages yet</div>
                </div>
            )}
        </>
    );
};
