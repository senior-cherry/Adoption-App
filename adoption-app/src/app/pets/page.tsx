"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PetLayout from "@/layouts/PetLayout";
import { Grid, Center, Text, Box, Flex, Badge, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import CardComponent from "@/components/CardComponent";

export default function Pets() {
    const searchParams = useSearchParams();
    const [pets, setPets] = useState([]);
    const [filterInfo, setFilterInfo] = useState({
        isFiltered: false,
        isRecommended: false,
        categories: [],
        totalRecommended: 0
    });

    useEffect(() => {
        const fetchPets = async () => {
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
            }
        };

        fetchPets();
    }, [searchParams]);

    const getStatusMessage = () => {
        if (filterInfo.isRecommended) {
            const foundCount = pets.length;
            const requestedCount = filterInfo.totalRecommended;

            if (foundCount < requestedCount) {
                return {
                    type: "warning",
                    title: "Some recommendations unavailable",
                    message: `Showing ${foundCount} of ${requestedCount} recommended pets. Some may no longer be available.`
                };
            } else if (foundCount > 0) {
                return {
                    type: "success",
                    title: "Perfect matches found!",
                    message: `We found ${foundCount} pets that match your lifestyle and preferences.`
                };
            }
        }
        return null;
    };

    const statusMessage = getStatusMessage();

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
                        <Text fontSize="sm" color="gray.600" mb={2}>
                            {filterInfo.isRecommended ? "From categories:" : "Filtered by:"}
                        </Text>
                        <Flex gap={2} flexWrap="wrap">
                            {filterInfo.categories.map(cat => (
                                <Badge
                                    key={cat}
                                    colorScheme={filterInfo.isRecommended ? "green" : "blue"}
                                    px={3}
                                    py={1}
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
                                        #{index + 1} Match
                                    </Badge>
                                )}
                            </Box>
                        ))}
                    </Grid>
                ) : (
                    <Center
                        h="300px"
                        w="full"
                        maxW="4xl"
                        flexDirection="column"
                        border="1px dashed"
                        borderColor="gray.300"
                        borderRadius="lg"
                        bg="gray.50"
                    >
                        <Text fontSize="xl" fontWeight="medium" color="gray.600" mb={2}>
                            {filterInfo.isRecommended
                                ? "No matching pets found"
                                : filterInfo.isFiltered
                                    ? "No pets in selected categories"
                                    : "No pets available"
                            }
                        </Text>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                            {filterInfo.isRecommended
                                ? "Try adjusting your preferences or browse different categories"
                                : filterInfo.isFiltered
                                    ? "Try selecting different categories or clear filters"
                                    : "Check back later for new pets"
                            }
                        </Text>
                    </Center>
                )}
            </Center>
        </PetLayout>
    );
}

