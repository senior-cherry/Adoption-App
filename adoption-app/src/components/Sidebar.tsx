import React from "react";
import ChatList from "@/components/ChatList";
import ChatForm from "@/components/ChatForm";
import {auth} from "@clerk/nextjs/server";

const getData = async () => {
    const userId = auth();
    const res = await fetch(`${process.env.BASE_URL}/api/chat/user/${userId.userId}`, {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

const Sidebar = async () => {
    const chats = await getData()
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
