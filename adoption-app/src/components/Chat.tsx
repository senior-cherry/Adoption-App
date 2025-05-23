import React, { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { handleNewMessage } from "@/actions/handleNewMessage";
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

    return (
        <div>
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

                        <div className="mt-3">
                            <label className="block text-sm font-medium">Your monthly income</label>
                            <select
                                name="income"
                                className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                            >
                                <option value="">Select your income range</option>
                                <option value="under_1000">Under $1,000</option>
                                <option value="1000_3000">$1,000–3,000</option>
                                <option value="3000_5000">$3,000–5,000</option>
                                <option value="over_5000">Over $5,000</option>
                            </select>
                        </div>

                        <div className="mt-3">
                            <label className="block text-sm font-medium">Your living situation</label>
                            <select
                                name="space"
                                className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                            >
                                <option value="">Select your living space</option>
                                <option value="rent_apartment">Renting an apartment</option>
                                <option value="own_apartment">Own an apartment</option>
                                <option value="rent_house">Renting a house</option>
                                <option value="own_house">Own a house</option>
                            </select>
                        </div>

                        <div className="mt-3">
                            <label className="block text-sm font-medium">Your free time per week</label>
                            <select
                                name="freeTime"
                                className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                            >
                                <option value="">Select free time</option>
                                <option value="less_than_5">Less than 5 hours</option>
                                <option value="5_10">5–10 hours</option>
                                <option value="10_20">10–20 hours</option>
                                <option value="20_plus">More than 20 hours</option>
                            </select>
                        </div>

                        <div className="mt-3">
                            <label className="block text-sm font-medium">Your experience with pets</label>
                            <select
                                name="experience"
                                className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                            >
                                <option value="">Select experience level</option>
                                <option value="none">No experience</option>
                                <option value="some">Some experience</option>
                                <option value="experienced">Experienced pet owner</option>
                            </select>
                        </div>

                        <div className="mt-3">
                            <label className="block text-sm font-medium">Do you have children?</label>
                            <select
                                name="kids"
                                className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                            >
                                <option value="">Select one</option>
                                <option value="no">No</option>
                                <option value="yes_under_5">Yes, under 5 years old</option>
                                <option value="yes_over_5">Yes, over 5 years old</option>
                                <option value="yes_mixed">Yes, mixed ages</option>
                            </select>
                        </div>

                        <div className="mt-3">
                            <label className="block text-sm font-medium">Why do you want a pet?</label>
                            <input
                                type="text"
                                name="reason"
                                placeholder="Type your reason..."
                                className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 placeholder-gray-500 focus:outline-none"
                            />
                        </div>

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
