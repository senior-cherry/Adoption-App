"use server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { prisma } from "@/utils/connect";
import { getTranslations } from "next-intl/server";
import {ChatCompletionMessageParam} from "openai/resources/chat/completions";

export const handleNewMessage = async (formData: FormData) => {
    const t = getTranslations("ai-helper");

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
    });

    const userId = auth().userId || "guest";
    const chatId = formData.get("chatId") as string;
    const rawMessage = (formData.get("newMessage") as string)?.trim();
    const pageContext = formData.get("pageContext") as string;
    const userRole = formData.get("userRole") as string;

    if (!rawMessage) return;

    const userInput = rawMessage;

    const systemMessage = `${(await t)("systemMessage")}
    ${(await t)("role")}: ${userRole}.
    ${(await t)("page")}: ${pageContext}.
    ${(await t)("task")}`;

    if (chatId === "ai-helper") {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                temperature: 0.2,
                messages: [
                    { role: "system", content: systemMessage },
                    { role: "user", content: userInput },
                ],
            });

            return { message: response.choices[0].message.content || "No response from AI" };
        } catch (error) {
            console.error("Error generating AI response", error);
            return { message: "Error generating AI response." };
        }
    }

    try {
        await prisma.message.create({
            data: {
                id: uuidv4(),
                chat_id: chatId,
                user_id: userId,
                content: userInput,
                role: "user",
                createdAt: new Date(),
            },
        });

        revalidatePath("/");

        const existingMessages = await prisma.message.findMany({
            where: { chat_id: chatId, user_id: userId },
            orderBy: { createdAt: "asc" },
            select: { role: true, content: true },
        }) as ChatCompletionMessageParam[];

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemMessage },
                ...existingMessages,
                { role: "user", content: userInput },
            ],
        });

        const botResponse = response.choices[0].message.content || "No response from bot";

        await prisma.message.create({
            data: {
                id: uuidv4(),
                chat_id: chatId,
                user_id: userId,
                content: botResponse,
                role: "assistant",
                createdAt: new Date(),
            },
        });

        revalidatePath("/");

        return { message: botResponse };
    } catch (error) {
        console.error("Error processing message", error);
        return { message: "Error processing your request." };
    } finally {
        await prisma.$disconnect();
    }
};
