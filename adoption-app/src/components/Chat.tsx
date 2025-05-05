import React, { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { handleNewMessage } from "@/app/actions/handleNewMessage";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box } from "@chakra-ui/react";
import { prisma } from "@/utils/connect";
import Loading from "@/components/Loading";

interface ChatProps {
    chatId: string;
}

const Chat = async ({ chatId }: ChatProps) => {
    const userId = auth();
    const messages = await prisma.message.findMany({
        where: {
            chat_id: chatId,
            user_id: userId.userId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const formFields = [
        { name: "income", placeholder: "Your monthly income" },
        { name: "space", placeholder: "Your apartment space (e.g., sq ft)" },
        { name: "freeTime", placeholder: "Your free time (hours per week)" },
        { name: "experience", placeholder: "Your experience with pets" },
        { name: "reason", placeholder: "Why you want a pet" },
    ];

    return (
        <div className="flex flex-col h-full p-6 bg-gray-900 text-gray-100">
            <form action={handleNewMessage} className="mb-6">
                <input type="hidden" name="chatId" value={chatId} />

                <Accordion allowToggle>
                    <AccordionItem>
                        <AccordionButton>
                            <Box as="span" flex="1" textAlign="left" className="text-lg font-semibold">
                                Type your own message
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                            <input
                                type="text"
                                name="newMessage"
                                placeholder="Type your message..."
                                className="w-full p-3 mt-2 text-gray-800 rounded bg-gray-200 placeholder-gray-500 focus:outline-none"
                            />
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionButton>
                            <Box as="span" flex="1" textAlign="left" className="text-lg font-semibold">
                                Fill out this form to get pet advice
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                            {formFields.map((field, index) => (
                                <div key={index} className="mt-3">
                                    <label className="block text-sm font-medium">{field.placeholder}</label>
                                    <input
                                        type="text"
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 placeholder-gray-500 focus:outline-none"
                                    />
                                </div>
                            ))}
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>

                <div className="flex gap-4 mt-6">
                    <button
                        type="submit"
                        className="flex-1 p-3 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                        name="sendBtn"
                    >
                        Send
                    </button>
                    <button
                        type="reset"
                        className="flex-1 p-3 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                    >
                        Reset
                    </button>
                </div>
            </form>

            <div className="flex-1 overflow-y-auto space-y-4">
                {messages.map((message) => (
                    <Suspense key={message.id} fallback={<Loading />}>
                        <div
                            className={`p-3 rounded-lg text-sm ${message.role === "user" ? "bg-teal-700 text-white self-end" : "bg-gray-700 text-white self-start"
                                }`}
                        >
                            {message.content}
                        </div>
                    </Suspense>
                ))}
            </div>
        </div>
    );
};

export default Chat;
