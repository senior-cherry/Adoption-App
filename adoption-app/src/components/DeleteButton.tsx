"use client";
import {useRouter} from "next/navigation";
import {Button, useToast} from "@chakra-ui/react";

const DeleteButton = ({ id, collection }: { id: string, collection: string }) => {
    const router = useRouter();
    const toast = useToast();

    const handleDelete = async () => {
        const res = await fetch(`/api/${collection}/${id}`, {
            method: "DELETE",
        });

        if (res.status === 200) {
            toast({
                title: 'Успіх',
                description: "Запит успішно виконано",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            setTimeout(() => {
                if (collection === "chat") {
                    router.push("/chat");
                } else {
                    router.refresh();
                }
            }, 1000);
        } else {
            const data = await res.json();
            toast({
                title: 'Помилка',
                description: data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    };

    return (
        <Button colorScheme='red' onClick={handleDelete}>Видалити</Button>
    );
};

export default DeleteButton;