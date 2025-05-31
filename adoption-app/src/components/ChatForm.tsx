"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { handleNewChat } from "@/actions/handleNewChat";
import {useTranslations} from "next-intl";

const ChatForm = () => {
    const t = useTranslations("chat");
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
                placeholder={t("addPlaceholder")}
                className="flex-1 p-2 text-black rounded bg-[#f5f5f5] placeholder-gray-500 focus:outline-none"
            />
            <button
                type="submit"
                className="w-full text-sm bg-[#3e3e3e] rounded hover:bg-[#575757] p-2 mt-2 text-white"
            >
                {t("addBtn")}
            </button>
        </form>
    );
};

export default ChatForm;
