import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/utils/connect";
import ChatClient from "./ChatClient";

interface ChatProps {
    chatId: string;
}

const Chat = async ({ chatId }: ChatProps) => {
    const userId = auth().userId;
    const messages = await prisma.message.findMany({
        where: { chat_id: chatId, user_id: userId },
        orderBy: { createdAt: "asc" },
        select: { id: true, content: true, role: true },
    });

    return <ChatClient chatId={chatId} initialMessages={messages} />;
};

export default Chat;

