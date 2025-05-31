import React from "react";
import ChatList from "@/components/ChatList";
import ChatForm from "@/components/ChatForm";
import {auth} from "@clerk/nextjs/server";
import {getBaseUrl} from "@/utils/getBaseUrl";
import {getLocale} from "next-intl/server";

const getData = async () => {
    const userId = auth();
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/chat/user/${userId.userId}`, {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

const Sidebar = async () => {
    const locale = await getLocale();
    const chats = await getData()
    return (
        <div className="w-82 h-full bg-[#1e1e1e] text-[#eaeaea] flex flex-col">
            <div className="p-4">
                <ChatForm />
            </div>
            <h1 className="text-xl font-bold p-4 border-b border-[#2e2e2e]">{locale === 'uk' ? "Історія чатів" : "Chat History"}</h1>
            <ChatList chats={chats} />
        </div>
    );
};

export default Sidebar;
