import React from "react";
import {auth} from "@clerk/nextjs/server";
import { handleNewMessage } from "@/app/actions/handleNewMessage";

interface ChatProps {
    chatId: string;
}

import {prisma} from "@/utils/connect";

const Chat: React.FC<ChatProps> = async ({ chatId }) => {
    const userId = auth();
    const messages = await prisma.message.findMany({
        where: {
            chat_id: chatId,
            user_id: userId.userId,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    return (
        <div className="flex flex-col h-full p-4 bg-[#1e1e1e] text-[#eaeaea]">
            <div className="flex-1 overflow-y-auto">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`p-2 my-2 rounded ${
                            message.role === 'user'
                                ? 'bg-blue-500 text-white self-end'
                                : 'bg-gray-500 text-black self-start'
                        }`}
                    >
                        {message.content}
                    </div>
                ))}
            </div>
            <form action={handleNewMessage} className="flex flex-col items-center mt-4">
                <input type="hidden" name="chatId" value={chatId} />
                <span className="text-center">Type your own message</span>
                <input
                type="text"
                name="newMessage"
                placeholder="Type your message..."
                className="flex-1 w-full p-2 text-black rounded-l bg-[#f5f5f5] placeholder-gray-500 focus:outline-none"
                /><br/>
                <span className="text-center">Or fill this form and assistant will help you choose the best option</span>
                <input
                    type="text"
                    name="income"
                    placeholder="Your monthly income..."
                    className="flex-1 w-full p-2 text-black rounded-l bg-[#f5f5f5] placeholder-gray-500 focus:outline-none"
                /><br/>
                <input
                    type="text"
                    name="space"
                    placeholder="Your apt space..."
                    className="flex-1 w-full p-2 text-black rounded-l bg-[#f5f5f5] placeholder-gray-500 focus:outline-none"
                /><br/>
                <input
                    type="text"
                    name="freeTime"
                    placeholder="Your free time..."
                    className="flex-1 w-full p-2 text-black rounded-l bg-[#f5f5f5] placeholder-gray-500 focus:outline-none"
                /><br/>
                <input
                    type="text"
                    name="experience"
                    placeholder="Your pet ownership experience..."
                    className="flex-1 w-full p-2 text-black rounded-l bg-[#f5f5f5] placeholder-gray-500 focus:outline-none"
                /><br/>
                <input
                    type="text"
                    name="reason"
                    placeholder="Your reason to adopt a pet..."
                    className="flex-1 w-full p-2 text-black rounded-l bg-[#f5f5f5] placeholder-gray-500 focus:outline-none"
                /><br/>
                <button
                    type="submit"
                    className="ml-2 text-sm bg-[#3e3e3e] hover:bg-[#575757] p-2 rounded-r text-white"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
