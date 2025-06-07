import React from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../lib/prisma";
import ChatClient from "./ChatClient";
import {getTranslations} from "next-intl/server";

interface ChatProps {
    chatId: string;
}

const Chat = async ({ chatId }: ChatProps) => {
    const t = getTranslations("chat");
    const userId = auth().userId;

    if (!userId) {
        return <div className="p-4">{(await t)("notSignedInMessage")}</div>;
    }

    const rawMessages = await prisma.message.findMany({
        where: { chat_id: chatId, user_id: userId },
        orderBy: { createdAt: "asc" },
        select: { id: true, content: true, role: true },
    });

    const messages = rawMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as "user" | "assistant",
    }));

    return <ChatClient chatId={chatId} initialMessages={messages} />;
};

export default Chat;
