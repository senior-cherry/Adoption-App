"use server";

import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { prisma } from "@/utils/connect";

interface Message {
    id: string;
    chat_id?: string;
    user_id?: string;
    content: string;
    role: "user" | "assistant";
    createdAt: string;
}

export const handleNewMessage = async (formData: FormData) => {
    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const userId = auth().userId || "guest";
    const chatId = formData.get("chatId") as string;
    const newMessage = formData.get("newMessage") as string;
    const pageContext = formData.get("pageContext") as string;
    const userRole = formData.get("userRole") as string;

    if (!newMessage || newMessage.trim() === "") return;

    const systemMessage = `You are an AI assistant for a pet adoption center.
    Your job is to provide helpful guidance based on the user's current page and role.
    User role: ${userRole}.
    Current page: ${pageContext}.
    Respond with short and actionable advice.`;

    if (chatId === "ai-helper") {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemMessage },
                    { role: "user", content: newMessage },
                ],
            });

            return { message: response.choices[0].message.content || "No response from AI" };
        } catch (error) {
            console.error("Error generating AI response", error);
            return { message: "Error generating AI response." };
        }
    }

    const userMessage: Message = {
        id: uuidv4(),
        chat_id: chatId,
        user_id: userId,
        content: newMessage,
        role: "user",
        createdAt: new Date().toISOString(),
    };

    try {
        await prisma.message.create({ data: userMessage });
        revalidatePath("/");

        const existingMessages = await prisma.message.findMany({
            where: { chat_id: chatId, user_id: userId },
            orderBy: { createdAt: "asc" },
            select: { role: true, content: true },
        });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemMessage },
                ...existingMessages,
                { role: "user", content: newMessage },
            ] as { role: "system" | "user" | "assistant"; content: string }[],
        });

        const botMessage: Message = {
            id: uuidv4(),
            chat_id: chatId,
            user_id: userId,
            content: response.choices[0].message.content || "No response from bot",
            role: "assistant",
            createdAt: new Date().toISOString(),
        };

        await prisma.message.create({ data: botMessage });
        revalidatePath("/");

        return { message: botMessage.content };
    } catch (error) {
        console.error("Error processing message", error);
        return { message: "Error processing your request." };
    } finally {
        await prisma.$disconnect();
    }
};

