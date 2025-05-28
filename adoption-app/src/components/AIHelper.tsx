"use client";
import { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { handleNewMessage } from "@/actions/handleNewMessage";
import { checkUserRole } from "@/utils/userUtils";
import {usePathname} from "next/navigation";
import {useLocale, useTranslations} from "next-intl";

export default function AIHelper() {
    const { session } = useSession();
    const { isLoaded } = useUser();
    const [message, setMessage] = useState("");
    const locale = useLocale();
    const t = useTranslations("ai-helper");
    const path = usePathname();

    const userRole = !isLoaded ? "guest" : checkUserRole(session) || "guest";

    useEffect(() => {
        const fetchHint = async () => {
            const formData = new FormData();
            formData.append("chatId", "ai-helper");
            formData.append("newMessage", t("message"));
            formData.append("pageContext", path);
            formData.append("userRole", userRole);

            const response = await handleNewMessage(formData);
            if (response?.message) {
                setMessage(response.message);
            }
        };

        fetchHint();

    }, [userRole, path, locale]);

    if (!message) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 shadow-lg rounded-lg w-80">
            <p className="text-sm">{message}</p>
        </div>
    );
}
