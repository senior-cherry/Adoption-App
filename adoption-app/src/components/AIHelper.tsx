"use client";
import { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { handleNewMessage } from "@/app/actions/handleNewMessage";
import { checkUserRole } from "@/utils/userUtils";
import {usePathname} from "next/navigation";

export default function AIHelper() {
    const { session } = useSession();
    const { isLoaded } = useUser();
    const [message, setMessage] = useState("");
    const path = usePathname();

    const userRole = !isLoaded ? "guest" : checkUserRole(session) || "guest";

    useEffect(() => {
        const fetchHint = async () => {
            const formData = new FormData();
            formData.append("chatId", "ai-helper");
            formData.append("newMessage", "Give me a hint.");
            formData.append("pageContext", path);
            formData.append("userRole", userRole);

            const response = await handleNewMessage(formData);
            if (response?.message) {
                setMessage(response.message);
            }
        };

        fetchHint();

    }, [userRole, path]);

    if (!message) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 shadow-lg rounded-lg w-80">
            <p className="text-sm">{message}</p>
        </div>
    );
}
