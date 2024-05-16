"use client";
import {redirect, useRouter} from "next/navigation";
import {useSession, useUser} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";
import {Button, useToast} from "@chakra-ui/react";

const DeleteButton = ({ id }: { id: string }) => {
    const {session} = useSession();
    const {isLoaded, user}  = useUser();
    const userRole = checkUserRole(session);

    const router = useRouter();
    const toast = useToast()

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (isLoaded) {
        if (userRole !== "org:admin") {
            redirect("/")
        }
    }

    const handleDelete = async () => {
        const res = await fetch(`http://localhost:3000/api/pets/${id}`, {
            method: "DELETE",
        });

        if (res.status === 200) {
            router.push("/dashboard");
            toast({
                title: 'Успіх',
                description: "Запис успішно виконано",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
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