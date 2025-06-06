"use client";
import {useRouter} from "next/navigation";
import {Button, useToast} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";

const DeleteButton = ({ id, collection, onDeleteSuccess }: { id: string, collection: string, onDeleteSuccess: () => void }) => {
    const t = useTranslations("delete-button");
    const router = useRouter();
    const toast = useToast();
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        if (isDeleted) {
            if (collection === "chat") {
                router.replace("/chat");
                router.refresh();
            } else {
                onDeleteSuccess?.();
            }
        }
    }, [isDeleted, collection, router, onDeleteSuccess]);

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/${collection}/${id}`, {
                method: "DELETE",
            });

            if (res.status === 200) {
                toast({
                    title: t("toastSuccessTitle"),
                    description: t("toastSuccessDescription"),
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setIsDeleted(true);
            } else {
                const data = await res.json();
                toast({
                    title: t("toastErrorTitle"),
                    description: data.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: t("toastErrorTitle"),
                description: t("toastErrorDescription"),
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }

        return (
            <Button colorScheme='red' onClick={handleDelete}>{t("btnTitle")}</Button>
        );
}

export default DeleteButton;