"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";

const AdoptButtonGroup = ({ pet_id, imageUrl, species }) => {
    const { isLoaded, user } = useUser();
    const router = useRouter();

    const handleAdoptClick = () => {
        router.push(`/adoption/create?id=${encodeURIComponent(pet_id)}&imageUrl=${encodeURIComponent(imageUrl)}&species=${encodeURIComponent(species)}`);
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
