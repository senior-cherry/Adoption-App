"use server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { prisma } from "@/utils/connect";
import { getTranslations } from "next-intl/server";

interface Message {
    id: string;
    chat_id?: string;
    user_id?: string;
    content: string;
    role: "user" | "assistant";
    createdAt: string;
}

export const handleNewMessage = async (formData: FormData) => {
    const t = getTranslations("ai-helper");

    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const userId = auth().userId || "guest";
    const chatId = formData.get("chatId") as string;
    const rawMessage = (formData.get("newMessage") as string)?.trim();
    const pageContext = formData.get("pageContext") as string;
    const userRole = formData.get("userRole") as string;

    const formFields = {
        income: formData.get("income"),
        space: formData.get("space"),
        freeTime: formData.get("freeTime"),
        experience: formData.get("experience"),
        kids: formData.get("kids"),
        reason: formData.get("reason"),
    };

    const isFormFilled = Object.values(formFields).some((val) => val && val.toString().trim() !== "");

    if (!rawMessage.trim() && !isFormFilled) return;

    const formattedForm = isFormFilled ? `
    - Income: ${formFields.income || "Not provided"}\n
    - Living situation: ${formFields.space || "Not provided"}\n
    - Free time: ${formFields.freeTime || "Not provided"}\n
    - Pet experience: ${formFields.experience || "Not provided"}\n
    - Children: ${formFields.kids || "Not provided"}\n
    - Reason for adopting: ${formFields.reason || "Not provided"}.\n
    `.trim() : "";

    let userInput = "";

    const availablePets = await prisma.pet.findMany({
        select: {
            name: true,
            species: true
        }
    });

    if (rawMessage) {
        userInput = [formattedForm, rawMessage].filter(Boolean).join("\n\n");
    } else if (formattedForm) {
        userInput = `${formattedForm}\n\nBased on this information, what kind of pet would be most suitable for this person?\n
        Recommend from available pets: ${JSON.stringify(availablePets)}`;
    } else {
        return;
    }


    const systemMessage = `${(await t)("systemMessage")}
    ${(await t)("role")}: ${userRole}.
    ${(await t)("page")}: ${pageContext}.
    ${(await t)("task")}`;

    if (chatId === "ai-helper") {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                temperature: 0.2,
                max_tokens: 100,
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

    const userMessage: Message = {
        id: uuidv4(),
        chat_id: chatId,
        user_id: userId,
        content: userInput,
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
                { role: "user", content: userInput },
            ],
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


