"use client";
import { useRouter } from "next/navigation";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {useTranslations} from "next-intl";

type AdoptButtonProps = {
    pet_id: string,
    imageUrl: string,
    species: string
}

const AdoptButtonGroup = ({ pet_id, imageUrl, species }: AdoptButtonProps) => {
    const { isLoaded, user } = useUser();
    const router = useRouter();
    const t = useTranslations("adoptBtnGroup");

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
            <Button isDisabled colorScheme="gray">{t("btnDisabled")}</Button>
        );
    }

    if (!isLoaded || isLoading) {
        return (
            <ButtonGroup spacing="2">
                <Button isLoading colorScheme="blue">{t("btnIsLoading")}...</Button>
            </ButtonGroup>
        );
    }

    return (
        <ButtonGroup spacing="2" flexDir="column" alignItems="start">
            {hasPendingRequest ? (
                <Button isDisabled colorScheme="gray">{t("underReviewBtn")}</Button>
            ) : (
                <Button colorScheme="blue" onClick={handleAdoptClick}>{t("adoptBtn")}</Button>
            )}
        </ButtonGroup>
    );
};

export default AdoptButtonGroup;
