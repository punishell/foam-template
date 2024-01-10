/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import React, { useEffect, useState } from "react";
import { SendHorizonal, Paperclip, X, Dot, DownloadIcon, Loader } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import dayJs from "dayjs";
import { MessageTypeEnums, useMessaging } from "@/providers/socketProvider";
import { Spinner } from "@/components/common";
import { formatBytes, getPreviewByType, getPreviewByTypeUrl } from "@/lib/utils";
import { type ImageUp } from "@/lib/types";
import { useDownloadAttachment } from "@/lib/api/upload";
import { AfroProfile } from "@/components/common/afro-profile";

const ChatBoxHeader = ({
    _id,
    title,
    description,
    time,
    score,
    avatar,
}: {
    _id: string;
    title: string;
    description: string;
    time: string;
    score: number;
    avatar: string;
}): React.JSX.Element => {
    return (
        <div className="mb-3 flex items-center justify-between gap-2 border-b border-line pb-3">
            <div className="flex items-center gap-2">
                {/* <div className="h-[50px] flex w-[50px] bg-black rounded-full"></div> */}
                <AfroProfile score={score} src={avatar} size="sm" url={`/talents/${_id}`} />
                <div className="flex flex-col gap-1">
                    <div className="text-lg font-medium leading-none text-title">{title}</div>
                    <div className="text-sm leading-none text-body">{description}</div>
                </div>
            </div>
            <div>
                <span className="text-body">Started: {time}</span>
            </div>
        </div>
    );
};

const MAX_LEN = 15;

const SingleAttachmentView = ({ img }: { img: unknown }): React.JSX.Element => {
    const downloadAttachments = useDownloadAttachment();
    const DownloadAttachment = (url: string): void => {
        downloadAttachments.mutate(url);
    };
    return (
        <div className="flex h-fit w-fit gap-2 rounded-lg bg-[#F7F9FA] p-4">
            <div className="flex w-10 flex-col items-center">
                <Image
                    className="min-h-[38px] min-w-[38px] rounded-lg"
                    src={
                        img?.file
                            ? getPreviewByType(img.file).preview
                            : getPreviewByTypeUrl(img?.url, img?.type).preview
                    }
                    alt="upload-picture"
                    width={38}
                    height={38}
                    objectFit="contain"
                />
            </div>
            <div className="flex w-64 flex-1 flex-col">
                <p className="text-sm text-title">
                    {img?.name.length > MAX_LEN ? `${img?.name.slice(0, MAX_LEN)}...` : img?.name}
                </p>
                <p className="flex items-center text-sm text-body">
                    {img?.file ? `${img.progress || 0}%` : dayJs(img?.createdAt).format("DD mmm, YYYY")}{" "}
                    <Dot size={20} /> <span>{img?.size}</span>
                </p>
            </div>
            <div className="flex w-10 items-center">
                {img?.file || downloadAttachments.isLoading ? (
                    <Loader size={20} className="animate-spin text-primary" />
                ) : (
                    <DownloadIcon
                        size={20}
                        className="cursor-pointer text-primary"
                        onClick={() => {
                            DownloadAttachment(img?.url);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

const RenderAttachmentViewer = ({
    images = [],
    align,
}: {
    images: unknown[];
    align?: "left" | "right";
}): React.JSX.Element => {
    return (
        <div className={`flex w-fit flex-col gap-2 ${align === "left" ? "ml-auto" : "mr-auto"}`}>
            {images?.map((img, i) => <SingleAttachmentView key={i} img={img} />)}
        </div>
    );
};

const RenderAttachmentPreviewer = ({
    images,
    removeImage,
}: {
    images: ImageUp[];
    removeImage: (id: string) => void;
}): React.JSX.Element | boolean => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const MAX_LEN = 10;
    return (
        images.length > 0 && (
            <div className="flex h-fit flex-row gap-4 overflow-x-auto py-4">
                {images.map((img) => (
                    <div key={img.id} className="relative flex flex-row gap-2 rounded-lg border p-2">
                        <span
                            className="absolute -right-3 -top-3 h-fit w-fit cursor-pointer rounded-full bg-[#CDCFD0] p-1"
                            onClick={() => {
                                removeImage(img.id);
                            }}
                            role="button"
                            onKeyDown={() => {
                                removeImage(img.id);
                            }}
                            tabIndex={0}
                        >
                            <X size={15} />{" "}
                        </span>
                        <div className="flex items-center">
                            <Image
                                className="min-h-[38px] min-w-[38px] rounded-lg"
                                src={img.preview}
                                alt="upload-picture"
                                width={38}
                                height={38}
                                objectFit="contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm text-title">
                                {img.name.length > MAX_LEN ? `${img.name.slice(0, MAX_LEN)}...` : img.name}
                            </p>
                            <p className="text-sm text-body">{img.size}</p>
                        </div>
                    </div>
                ))}
            </div>
        )
    );
};

const Messages = ({ messages }: { messages: [] }): React.JSX.Element => {
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

interface Props {
    params: {
        "message-id": string;
    };
}

export default function Chat({ params }: Props): React.JSX.Element {
    const { "message-id": messageId } = params;
    const { currentConversation, loadingChats, setActiveConversation, sendUserMessage, markUserMessageAsSeen } =
        useMessaging();
    const [loadingMessage, setLoadingMessages] = useState(true);
    const [text, setText] = useState("");
    const [imageFiles, setImageFiles] = useState<ImageUp[] | []>([]);

    const loadMessages = async (): Promise<void> => {
        setActiveConversation(messageId);
        setLoadingMessages(false);
        await markUserMessageAsSeen(messageId);
    };

    const messages = currentConversation?.messages || [];

    useEffect(() => {
        if (!loadingChats) void loadMessages();
    }, [loadingChats]);

    const scrollMessages = (): void => {
        setTimeout(() => {
            const objDiv = document.getElementById("chat_div");
            if (objDiv) {
                objDiv.scrollTop = objDiv.scrollHeight;
            }
        }, 50);
    };

    useEffect(() => {
        scrollMessages();
    }, [currentConversation?.messages]);

    const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
        const files = acceptedFiles.map((f, i) => ({
            file: f,
            preview: getPreviewByType(f).preview,
            type: getPreviewByType(f).type,
            id: String(i),
            name: f.name,
            size: formatBytes(f.size, 0),
        }));
        setImageFiles(files);
    }, []);

    const onDropError = React.useCallback(async (data: unknown) => {
        console.log("Rr-->", data);
    }, []);

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        onError: onDropError,
        maxSize: 2000000,
        maxFiles: 5,
        accept: {
            "image/*": [],
            "application/*": [".pdf", ".doc", ".docx"],
            "text/*": [".csv"],
        },
        noClick: true,
    });

    if (loadingMessage)
        return (
            <div className="flex h-full w-full grow flex-col items-center justify-center gap-1">
                <Spinner />
            </div>
        );

    const sendMessage = async (): Promise<void> => {
        if (text !== "" || imageFiles.length > 0) {
            await sendUserMessage(
                currentConversation?.recipient?._id,
                currentConversation?.sender?._id,
                MessageTypeEnums.TEXT,
                text,
                currentConversation.id,
                imageFiles,
            );
            setText("");
            setImageFiles([]);
        }
    };

    const removeImg = (id: string): void => {
        const newImages = imageFiles.filter((f) => f.id !== id);
        setImageFiles(newImages);
    };

    const onKeyDownPress = async (e: React.KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            return sendMessage();
        }
    };
    return (
        <div className="flex h-full flex-col">
            <ChatBoxHeader
                _id={currentConversation?.header._id ?? ""}
                title={currentConversation?.header?.title}
                description={currentConversation?.header?.description}
                time={currentConversation?.createdAt}
                avatar={currentConversation?.header?.avatar}
                score={currentConversation?.header?.score}
            />
            <div className="w-full grow basis-0 overflow-y-auto">
                <Messages messages={messages} />
            </div>
            <div className="flex w-full  flex-row gap-2" {...getRootProps()}>
                <div className="flex w-10 items-end">
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full border bg-[#008D6C1A] text-primary"
                        onClick={open}
                        type="button"
                    >
                        <Paperclip size={16} />
                        <input {...getInputProps()} />
                    </button>
                </div>
                <div className="flex w-64 flex-1 flex-col rounded-2xl border bg-gray-50 p-4">
                    <textarea
                        rows={1}
                        className="w-full grow resize-none rounded-t-lg bg-gray-50 p-2 focus:outline-none"
                        placeholder="Write your message..."
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                        }}
                        onKeyDown={onKeyDownPress}
                    />
                    <RenderAttachmentPreviewer images={imageFiles} removeImage={removeImg} />
                </div>
                <div className="flex w-10 items-end">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full border bg-primary-gradient text-white"
                        onClick={sendMessage}
                        type="button"
                    >
                        <SendHorizonal size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
