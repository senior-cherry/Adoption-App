'use client';

import React, { useCallback } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";

interface ChatListProps {
    chats: { id: string, name: string }[];
}

const ChatList = ({ chats }: ChatListProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        }, [searchParams]
    )

    const handleChatClick = (id: string) => {
        router.push(`${pathname}?${createQueryString('chatId', id)}`);
    }

    return (
        <ul className="flex-1 overflow-auto">
            {
                Array.isArray(chats) ? (
                    chats.map((chat) => {
                        return (
                            <div className="flex items-center gap-2 border-b border-[#2e2e2e] justify-between" key={chat.id}>
                                <li onClick={() => handleChatClick(chat.id)}
                                    className="p-4 cursor-pointer hover:text-teal-200">
                                    {chat.name}
                                </li>
                                    <ConfirmModal id={chat.id} collection={"chat"} />
                            </div>
                        );
                    }
                    )
                ) : (
                    <li>No chats available</li>
                )
            }
        </ul>
    );
}

export default ChatList;
