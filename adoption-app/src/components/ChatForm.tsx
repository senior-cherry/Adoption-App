"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { handleNewChat } from "@/actions/handleNewChat";

const ChatForm = () => {
    const router = useRouter();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await handleNewChat(formData);
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <input
                type="text"
                name="chatName"
                placeholder="Add new chat name"
                className="flex-1 p-2 text-black rounded bg-[#f5f5f5] placeholder-gray-500 focus:outline-none"
            />
            <button
                type="submit"
                className="w-full text-sm bg-[#3e3e3e] rounded hover:bg-[#575757] p-2 mt-2 text-white"
            >
                Add
            </button>
        </form>
    );
};

export default ChatForm;
