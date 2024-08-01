'use server';

import OpenAI from "openai";
import {auth} from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

import {prisma} from "@/utils/connect";

interface Message {
    id: string;
    chat_id: string;
    user_id?: string;
    content: string;
    role: 'user' | 'assistant';
    createdAt: string;
}

export const handleNewMessage = async (formData: FormData) => {
    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
    });

    let newMessage;
    const income = formData.get("income");
    const space = formData.get("space");
    const freeTime = formData.get("freeTime");
    const experience = formData.get("experience");
    const reason = formData.get("reason");

    if (formData.get("newMessage") !== "") {
        newMessage = formData.get("newMessage");
    } else {
        newMessage = "Give me the best pet to adopt based on this information:\n" +
            `Monthly income: ${income}, Free space: ${space}, Free time: ${freeTime}, Pet ownership experience: ${experience}, 
        Reason to adopt a pet: ${reason}`;
    }

    const chatId = formData.get("chatId");

    if (!newMessage || typeof newMessage !== 'string') return;
    if (!chatId || typeof chatId !== 'string') return;
    if (newMessage.trim() === "") return;

    const userId = auth();

    const userMessage: Message = {
        id: uuidv4(),
        chat_id: chatId,
        user_id: userId.userId || undefined,
        content: newMessage,
        role: 'user',
        createdAt: new Date().toISOString()
    };

    try {
        await prisma.message.create({
            data: userMessage,
        });

        revalidatePath("/");

        const existingMessages = await prisma.message.findMany({
            where: {
                chat_id: chatId,
                user_id: userId.userId,
            },
            orderBy: {
                createdAt: 'asc',
            },
            select: {
                role: true,
                content: true,
            },
        });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant" },
                ...existingMessages,
                { role: "user", content: newMessage },
            ] as { role: "system" | "user" | "assistant"; content: string }[],
        });

        const botMessage: Message = {
            id: uuidv4(),
            chat_id: chatId,
            user_id: userId.userId,
            content: response.choices[0].message.content || "No response from bot",
            role: "assistant",
            createdAt: new Date().toISOString(),
        };

        await prisma.message.create({
            data: botMessage,
        });

        revalidatePath("/");
    } catch (error) {
        console.error("Error processing message", error);
    } finally {
        await prisma.$disconnect();
    }
};

