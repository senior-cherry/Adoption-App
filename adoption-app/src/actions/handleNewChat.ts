'use server';

import { revalidatePath } from 'next/cache';
import {prisma} from "@/utils/connect";
import {auth} from "@clerk/nextjs/server";

export const handleNewChat = async (formData: FormData): Promise<void> => {
    const chatName = formData.get('chatName') as string | null;
    const userId = auth();

    if (chatName) {
        try {
            await prisma.chat.create({
                data: {
                    name: chatName,
                    user_id: userId.userId
                },
            });

            revalidatePath('/');
        } catch (error) {
            console.error("Error creating new chat", error);
        } finally {
            await prisma.$disconnect();
        }
    }
};
