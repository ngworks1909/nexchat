"use client"

import React, { useEffect, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, isToday, isYesterday } from 'date-fns'
import Image from 'next/image'
import MessageStatus from '../messages/MessageStatus'
import { useRecoilValue } from 'recoil'
import { SelectedChatState } from '@/atoms/SelectedChatState'
import { useMessages } from '@/hooks/useMessages'
import { useSession } from 'next-auth/react'
import { SessionUser } from '@/hooks/useAddFriend'

export default function ChatMain() {
    const selectedChat = useRecoilValue(SelectedChatState);
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const session = useSession();
    const user: SessionUser = session.data?.user as SessionUser
    const currentUserId = user?.id

    const { messages, loading } = useMessages();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [selectedChat, messages])

    const formatMessageDate = (date: Date) => {
        if (isToday(date)) {
            return 'Today';
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else {
            return format(date, 'MMMM d, yyyy');
        }
    }

    

    return (
        <ScrollArea 
            className="flex-grow px-4 sm:px-6 bg-[#f9eee5] md:bg-gray-100" 
            ref={scrollAreaRef}
        >
            {loading && <span>Loading...</span>}
            {messages.reduce((acc: JSX.Element[], message, index) => {
                if (index === 0 || 
                    formatMessageDate(new Date(message.createdAt)) !== 
                    formatMessageDate(new Date(messages[index - 1].createdAt))) {
                    acc.push(
                        <div key={`date-${message.createdAt}`} className="flex justify-center my-6">
                            <div className="bg-white rounded-full px-3 py-1 text-xs text-gray-500">
                                {formatMessageDate(new Date(message.createdAt))}
                            </div>
                        </div>
                    )
                }

                const isOutgoing = message.senderId === currentUserId;

                acc.push(
                    <div
                        key={message.messageId}
                        className={`flex ${
                            isOutgoing ? 'justify-end' : 'justify-start'
                        } mb-2`}
                    >
                        <div
                            className={`max-w-[90%] md:max-w-[60%] rounded-lg ${message.messageType === 'text' ? 'px-3' : 'px-1'} py-1 text-gray-800 ${
                                isOutgoing ? 'bg-emerald-100' : 'bg-white'
                            }`}
                        >
                            <div className="flex flex-col">
                                {message.messageType === 'text' && (
                                    <div className="flex flex-wrap items-end gap-2">
                                        <p className="text-md inline">
                                            {message.message}
                                            <span className={`float-right inline-flex items-center justify-end gap-2 ml-3 mt-2 ${message.messageStatus === 'Sent' && 'gap-[3px]'}`}>
                                                <span className="text-[10px] opacity-75 w-max">
                                                    {format(new Date(message.createdAt), 'h:mm a')}
                                                </span>
                                                {isOutgoing && (
                                                    <MessageStatus className='text-[10px]' status={message.messageStatus} />
                                                )}
                                            </span>
                                        </p> 
                                    </div>
                                )}

                                {message.messageType === 'image' && (
                                    <div className="flex flex-wrap items-end gap-2 relative">
                                        <input type = "image"
                                            src={message.message}
                                            alt="Shared image" 
                                            className="rounded-lg w-56 h-56 shadow-md cursor-pointer"
                                        />
                                        <div className="items-center w-full bg-image-bottom absolute flex justify-end text-white gap-2">
                                            <p className="text-[10px] opacity-75 whitespace-nowrap">
                                                {format(new Date(message.createdAt), 'h:mm a')}
                                            </p>
                                            {isOutgoing && (
                                                <MessageStatus className='text-[10px]' status={message.messageStatus} />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {message.messageType === 'audio' && (
                                    <div className="flex flex-wrap items-end gap-2">
                                        <div>
                                            <p className="text-sm">Voice message</p>
                                            <audio controls src={message.message} className="mt-1 w-max max-w-[300px]" />
                                        </div>
                                        <div className="inline-flex items-center gap-2 ml-auto">
                                            <p className="text-[10px] opacity-75 whitespace-nowrap">
                                                {format(new Date(message.createdAt), 'h:mm a')}
                                            </p>
                                            {isOutgoing && (
                                                <MessageStatus className='text-[10px]' status={message.messageStatus} />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {message.messageType === 'video' && (
                                    <div className="flex flex-wrap items-end gap-2 relative">
                                        <video controls src={message.message} className="rounded-lg max-w-full h-auto" style={{ maxHeight: '200px' }} />
                                        <div className="items-center w-full bg-image-bottom absolute flex justify-end text-white gap-2">
                                            <p className="text-[10px] opacity-75 whitespace-nowrap">
                                                {format(new Date(message.createdAt), 'h:mm a')}
                                            </p>
                                            {isOutgoing && (
                                                <MessageStatus className='text-[10px]' status={message.messageStatus} />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )

                return acc
            }, [])}
            <div ref={messagesEndRef} />
        </ScrollArea>
    )
}

