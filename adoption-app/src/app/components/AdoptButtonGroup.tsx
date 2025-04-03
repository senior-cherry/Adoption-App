// "use client";
// import { Button, ButtonGroup, useToast } from "@chakra-ui/react";
// import { useUser } from "@clerk/nextjs";
//
// // @ts-ignore
// const AdoptButtonGroup = ({ pet, imageUrl }) => {
//     const { isLoaded, user } = useUser();
//     const toast = useToast()
//
//     const adoptPet = async () => {
//
//         const adoptionData = {
//             pet: pet,
//             imageUrl: imageUrl,
//             user: user?.fullName,
//             email: user?.emailAddresses[0].emailAddress
//         }
//
//         const res = await fetch("http://localhost:3000/api/adoption", {
//             method: 'POST',
//             body: JSON.stringify(adoptionData)
//         })
//
//         const data = await res.json();
//
//         if (res.status >= 200 && res.status < 300) {
//             toast({
//                 title: 'Успіх',
//                 description: "Запит успішно виконано",
//                 status: 'success',
//                 duration: 5000,
//                 isClosable: true,
//             })
//         } else {
//             toast({
//                 title: 'Помилка',
//                 description: data.message,
//                 status: 'error',
//                 duration: 5000,
//                 isClosable: true,
//             })
//         }
//     }
//
//     return (
//         <ButtonGroup spacing='2'>
//             {user && isLoaded ? (
//                 <Button variant='solid' colorScheme='blue' onClick={adoptPet}>
//                     Взяти тварину
//                 </Button>
//             ) : (
//                 <Button variant='solid' colorScheme='blue' isDisabled={true}>
//                     Взяти тварину
//                 </Button>
//             )}
//         </ButtonGroup>
//     );
// }
//
// export default AdoptButtonGroup;

"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";

const AdoptButtonGroup = ({ pet, imageUrl, species }) => {
    const { isLoaded, user } = useUser();
    const router = useRouter();

    const handleAdoptClick = () => {
        router.push(`/adoption/create?pet=${encodeURIComponent(pet)}&imageUrl=${encodeURIComponent(imageUrl)}&species=${encodeURIComponent(species)}`);
    };

    return (
        <ButtonGroup spacing="2">
            {user && isLoaded ? (
                <Button variant="solid" colorScheme="blue" onClick={handleAdoptClick}>
                    Взяти тварину
                </Button>
            ) : (
                <Button variant="solid" colorScheme="blue" isDisabled={true}>
                    Взяти тварину
                </Button>
            )}
        </ButtonGroup>
    );
};

export default AdoptButtonGroup;
