"use client";
import {useEffect, useState} from "react";
import { handleNewMessage } from "@/actions/handleNewMessage";
import {useTranslations} from "next-intl";

interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
}

interface ChatClientProps {
    chatId: string;
    initialMessages: Message[];
}

const ChatClient = ({ chatId, initialMessages }: ChatClientProps) => {
    const t = useTranslations("chat");
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        setMessages(initialMessages);
    }, [chatId, initialMessages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: newMessage,
            role: "user",
        };

        setMessages((prev) => [...prev, userMessage]);
        setNewMessage("");
        setIsTyping(true);

        try {
            const formData = new FormData();
            formData.append("chatId", chatId);
            formData.append("newMessage", newMessage);

            const response = await handleNewMessage(formData);
            if (response?.message) {
                const aiMessage: Message = {
                    id: Date.now().toString(),
                    content: response.message,
                    role: "assistant",
                };
                setMessages((prev) => [...prev, aiMessage]);
            }
        } catch (error) {
            console.error("AI response failed", error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="mb-6">
                <input type="hidden" name="chatId" value={chatId} />
                <input
                    type="text"
                    name="newMessage"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t("inputPlaceholder")}
                    className="w-full p-3 mt-2 text-gray-800 rounded bg-gray-200 placeholder-gray-500 focus:outline-none"
                />
                <div className="flex gap-4 mt-6">
                    <button
                        type="submit"
                        className="flex-1 p-3 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                    >
                        {t("sendBtn")}
                    </button>
                    <button
                        type="reset"
                        className="flex-1 p-3 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                        onClick={() => setNewMessage("")}
                    >
                        {t("resetBtn")}
                    </button>
                </div>
            </form>

            <div className="flex-1 overflow-y-auto space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`p-3 rounded-lg text-sm ${
                            message.role === "user" ? "bg-teal-700 text-white self-end" : "bg-gray-700 text-white self-start"
                        }`}
                    >
                        {message.content}
                    </div>
                ))}

                {isTyping && (
                    <div className="p-3 rounded-lg text-sm bg-gray-500 text-white self-start animate-pulse">
                        {t("typing")}...
                    </div>
                )}
            </div>
        </>
    );
};

export default ChatClient;
