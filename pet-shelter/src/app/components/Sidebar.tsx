import React from "react";
import {auth, getAuth} from "@clerk/nextjs/server";
import ChatList from "@/app/components/ChatList";
import { GetServerSideProps } from "next";
import ChatForm from "@/app/components/ChatForm";

import {prisma} from "@/utils/connect";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const userId = auth();
    const {chats} = await prisma.chat.findMany({
        where: { user_id: userId.userId },
        orderBy: { created_at: 'desc' },
        select: { id: true, name: true },
    });

    return {
        props: {
            chats,
        },
    };
};

interface SidebarProps {
    chats: { id: string, name: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ chats }) => {
    return (
        <div className="w-82 h-full bg-[#1e1e1e] text-[#eaeaea] flex flex-col">
            <div className="p-4 border-b border-[#2e2e2e]">
                <ChatForm />
            </div>
            <h1 className="text-xl font-bold p-4">Chat History</h1>
            <ChatList chats={chats} />
        </div>
    );
};

export default Sidebar;
