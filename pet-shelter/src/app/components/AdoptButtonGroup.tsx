"use client";
import {Button, ButtonGroup, useToast} from "@chakra-ui/react";
import {useUser} from "@clerk/nextjs";

// @ts-ignore
const AdoptButtonGroup = ({ pet, imageUrl }) => {
    const {isLoaded, user}  = useUser();
    const toast = useToast()

    const adoptPet = async () => {

        const adoptionData = {
            pet: pet,
            imageUrl: imageUrl,
            user: user?.fullName,
            email: user?.emailAddresses[0].emailAddress
        }

        console.log(adoptionData)

        const res = await fetch("/api/adoption", {
            method: 'POST',
            body: JSON.stringify(adoptionData)
        })

        const data = await res.json();
        console.log(data);

        if (res.status >= 200 && res.status < 300) {
            toast({
                title: 'Успіх',
                description: "Запит успішно виконано",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        } else {
            toast({
                title: 'Помилка',
                description: data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    return (
        <ButtonGroup spacing='2'>
            {user && isLoaded ? (
                <Button variant='solid' colorScheme='blue' onClick={adoptPet}>
                    Взяти тварину
                </Button>
            ) : (
                <Button variant='solid' colorScheme='blue' isDisabled={true}>
                    Взяти тварину
                </Button>
            )}
        </ButtonGroup>
    );
}

export default AdoptButtonGroup;