"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonGroup, Text } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const AdoptButtonGroup = ({ pet_id, imageUrl, species }) => {
    const { isLoaded, user } = useUser();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [hasPendingRequest, setHasPendingRequest] = useState(false);

    useEffect(() => {
        const checkRequest = async () => {
            if (user && isLoaded) {
                const res = await fetch(`/api/adoption/check?userId=${user.id}&petId=${pet_id}`);
                const data = await res.json();
                setHasPendingRequest(data.exists);
                setIsLoading(false);
            }
        };
        checkRequest();
    }, [user, isLoaded, pet_id]);

    const handleAdoptClick = () => {
        router.push(`/adoption/create?id=${encodeURIComponent(pet_id)}&imageUrl=${encodeURIComponent(imageUrl)}&species=${encodeURIComponent(species)}`);
    };

    if (!user) {
        return (
            <Button isDisabled colorScheme="gray">Увійдіть щоб подати</Button>
        );
    }

    if (!isLoaded || isLoading) {
        return (
            <ButtonGroup spacing="2">
                <Button isLoading colorScheme="blue">Перевірка...</Button>
            </ButtonGroup>
        );
    }

    return (
        <ButtonGroup spacing="2" flexDir="column" alignItems="start">
            {hasPendingRequest ? (
                <Button isDisabled colorScheme="gray">Заявка вже на розгляді</Button>
            ) : (
                <Button colorScheme="blue" onClick={handleAdoptClick}>
                    Взяти тварину
                </Button>
            )}
        </ButtonGroup>
    );
};

export default AdoptButtonGroup;
