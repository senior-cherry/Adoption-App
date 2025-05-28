// "use client";
// import {useRouter} from "next/navigation";
// import {Button, useToast} from "@chakra-ui/react";
//
// const DeleteButton = ({ id, collection }: { id: string, collection: string }) => {
//     const router = useRouter();
//     const toast = useToast();
//
//     const handleDelete = async () => {
//         const res = await fetch(`/api/${collection}/${id}`, {
//             method: "DELETE",
//         });
//
//         if (res.status === 200) {
//             toast({
//                 title: 'Успіх',
//                 description: "Запит успішно виконано",
//                 status: 'success',
//                 duration: 3000,
//                 isClosable: true,
//             });
//
//             setTimeout(() => {
//                 if (collection === "chat") {
//                     window.location.href = "/chat";
//                 } else {
//                     router.refresh();
//                 }
//             }, 1000);
//
//     } else {
//             const data = await res.json();
//             toast({
//                 title: 'Помилка',
//                 description: data.message,
//                 status: 'error',
//                 duration: 5000,
//                 isClosable: true,
//             })
//         }
//     };
//
//     return (
//         <Button colorScheme='red' onClick={handleDelete}>Видалити</Button>
//     );
// };
//
// export default DeleteButton;

"use client";
import {useRouter} from "next/navigation";
import {Button, useToast} from "@chakra-ui/react";
import {useEffect, useState} from "react";

const DeleteButton = ({ id, collection }: { id: string, collection: string }) => {
    const router = useRouter();
    const toast = useToast();
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        if (isDeleted && collection === "chat") {
            router.replace("/chat");
            router.refresh();
        }
    }, [isDeleted, collection, router]);

    const handleDelete = async () => {
        try {
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
                    setIsDeleted(true);

                    if (collection !== "chat") {
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
                });
            }
        } catch (error) {
            toast({
                title: 'Помилка',
                description: "Щось пішло не так",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }

        return (
            <Button colorScheme='red' onClick={handleDelete}>Видалити</Button>
        );
}

export default DeleteButton;