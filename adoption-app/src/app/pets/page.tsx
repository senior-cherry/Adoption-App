"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PetLayout from "@/layouts/PetLayout";
import { Grid, Center, Text, Box, Flex, Badge, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import CardComponent from "@/components/CardComponent";
import {useLocale, useTranslations} from "next-intl";
import Loading from "@/components/Loading";

export default function Pets() {
    const locale = useLocale();
    const t = useTranslations("pets-page");
    const searchParams = useSearchParams();
    const [pets, setPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterInfo, setFilterInfo] = useState({
        isFiltered: false,
        isRecommended: false,
        categories: [],
        totalRecommended: 0
    });

    useEffect(() => {
        const fetchPets = async () => {
            setIsLoading(true);
            const cat = searchParams.get("cat");
            const recommended = searchParams.get("recommended");

            try {
                let queryUrl = "/api/pets";
                const params = new URLSearchParams();

                if (recommended) {
                    params.append("recommended", recommended);
                }

                if (cat) {
                    params.append("cat", cat);
                }

                if (params.toString()) {
                    queryUrl += `?${params.toString()}`;
                }

                const res = await fetch(queryUrl);
                const data = await res.json();
                setPets(data);

                setFilterInfo({
                    isFiltered: Boolean(cat || recommended),
                    isRecommended: Boolean(recommended),
                    categories: cat ? cat.split(",") : [],
                    totalRecommended: recommended ? recommended.split(",").length : 0
                });

            } catch (error) {
                console.error("Error fetching pets:", error);
                setPets([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPets();
    }, [searchParams, locale]);

    const getStatusMessage = () => {
        if (filterInfo.isRecommended) {
            const foundCount = pets.length;
            const requestedCount = filterInfo.totalRecommended;

            if (foundCount < requestedCount) {
                return {
                    type: "warning",
                    title: locale === 'uk' ? "Деякі рекомендації недоступні" : "Some recommendations are unavailable",
                    message: locale === 'uk' ? `Знайдено ${foundCount} з ${requestedCount} рекомендованих улюбленців. Деякі вже можуть бути недоступними.`
                        : `Showing ${foundCount} of ${requestedCount} recommended pets. Some may no longer be available.`
                };
            } else if (foundCount > 0) {
                return {
                    type: "success",
                    title: locale === 'uk' ? "Ми знайшли чудові варіанти для вас" : "Perfect matches were found for you",
                    message: locale === 'uk' ? `Було знайдено ${foundCount} улюбленців відповідно до вашого стилю життя і побажань.`
                        :`We found ${foundCount} pets that match your lifestyle and preferences.`
                };
            }
        }
        return null;
    };

    const statusMessage = getStatusMessage();

    if (isLoading) {
        return (
            <PetLayout>
                <Flex direction="column" align="center" gap={4}>
                    <Loading />
                    <Text color="gray.600">{t("loading")}...</Text>
                </Flex>
            </PetLayout>
        );
    }

    return (
        <PetLayout>
            <Center flexDirection="column" w="full">
                {statusMessage && (
                    <Box mb={6} w="full" maxW="4xl">
                        <Alert status={statusMessage.type} borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <AlertTitle>{statusMessage.title}</AlertTitle>
                                <AlertDescription>{statusMessage.message}</AlertDescription>
                            </Box>
                        </Alert>
                    </Box>
                )}

                {filterInfo.categories.length > 0 && (
                    <Box mb={6} w="full" maxW="4xl">
                        <Text fontSize="md" color="gray.600" mb={2}>
                            {filterInfo.isRecommended ? `${t("byCategory")}:` : `${t("filteredBy")}:`}
                        </Text>
                        <Flex gap={2} flexWrap="wrap">
                            {filterInfo.categories.map(cat => (
                                <Badge
                                    key={cat}
                                    colorScheme={filterInfo.isRecommended ? "green" : "blue"}
                                    px={5}
                                    py={2}
                                    borderRadius="full"
                                    textTransform="capitalize"
                                >
                                    {cat.replace("-", " ")}
                                </Badge>
                            ))}
                        </Flex>
                    </Box>
                )}

                {pets.length > 0 ? (
                    <Grid gap={10} className="pet-grid">
                        {pets.map((pet, index) => (
                            <Box key={pet.id} position="relative">
                                <CardComponent pet={pet} />
                                {filterInfo.isRecommended && (
                                    <Badge
                                        position="absolute"
                                        top={2}
                                        right={2}
                                        colorScheme="green"
                                        variant="solid"
                                        borderRadius="full"
                                        px={2}
                                        py={1}
                                        fontSize="xs"
                                        zIndex={1}
                                    >
                                        #{index + 1} {t("match")}
                                    </Badge>
                                )}
                            </Box>
                        ))}
                    </Grid>
                ) : (
                    <Center
                        h="200px"
                        w="full"
                        maxW="4xl"
                        flexDirection="column"
                    >
                        <Text fontSize="lg" color="gray.600" mb={2}>
                            {t("noPets")}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            {t("adjustCriteria")}
                        </Text>
                    </Center>
                )}
            </Center>
        </PetLayout>
    );
}