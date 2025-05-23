"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import CategoryDropdown from "@/components/CategoryDropdown";
import { useRouter, useSearchParams } from "next/navigation";

const DrawerFilter = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const toast = useToast();

    const [formData, setFormData] = useState({
        income: "",
        space: "",
        freeTime: "",
        experience: "",
        kids: "",
    });

    useEffect(() => {
        const cat = searchParams.get("cat");
        if (cat) {
            const categories = cat.split(",").filter(Boolean);
            setSelectedCategories(categories);
        }
    }, [searchParams]);

    const handleCategoriesChange = (options) => {
        setSelectedCategories(options);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const hasFormData = Object.values(formData).some(value => value !== "");

            if (hasFormData) {
                const response = await fetch('/api/pets/recommend', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        categories: selectedCategories,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to get recommendations');
                }

                const recommendedPets = await response.json();

                if (recommendedPets && recommendedPets.length > 0) {
                    const petIds = recommendedPets.map(pet => pet.id).join(',');
                    const categoryParam = selectedCategories.length > 0 ? `&cat=${selectedCategories.join(',')}` : '';
                    router.push(`/pets?recommended=${petIds}${categoryParam}`);
                } else {
                    toast({
                        title: "No matching pets found",
                        description: "Try adjusting your preferences or browse by categories",
                        status: "info",
                        duration: 5000,
                        isClosable: true,
                    });

                    if (selectedCategories.length > 0) {
                        router.push(`/pets?cat=${selectedCategories.join(',')}`);
                    } else {
                        router.push('/pets');
                    }
                }
            } else if (selectedCategories.length > 0) {
                router.push(`/pets?cat=${selectedCategories.join(',')}`);
            } else {
                router.push('/pets');
            }
            onClose();
        } catch (error) {
            console.error('Error applying filters:', error);
            toast({
                title: "Error applying filters",
                description: "Something went wrong. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setSelectedCategories([]);
        setFormData({
            income: "",
            space: "",
            freeTime: "",
            experience: "",
            kids: "",
        });
        router.push('/pets');
    };

    return (
        <>
            <Button size="md" colorScheme="teal" m={6} onClick={onOpen}>
                Filter Pets
            </Button>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Find Your Perfect Pet</DrawerHeader>
                    <DrawerBody>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <p className="font-medium mb-2">Pet Categories</p>
                                <CategoryDropdown
                                    onChange={handleCategoriesChange}
                                    selectedCategories={selectedCategories}
                                />
                            </div>

                            <hr className="my-4" />

                            <p className="font-medium mb-3">Tell us about yourself for AI recommendations</p>
                            <div className="mt-3">
                                <label className="block text-sm font-medium">Your monthly income</label>
                                <select
                                    name="income"
                                    value={formData.income}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                                >
                                    <option value="">Select your income range</option>
                                    <option value="under_1000">Under $1,000</option>
                                    <option value="1000_3000">$1,000–3,000</option>
                                    <option value="3000_5000">$3,000–5,000</option>
                                    <option value="over_5000">Over $5,000</option>
                                </select>
                            </div>

                            <div className="mt-3">
                                <label className="block text-sm font-medium">Your living situation</label>
                                <select
                                    name="space"
                                    value={formData.space}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                                >
                                    <option value="">Select your living space</option>
                                    <option value="rent_apartment">Renting an apartment</option>
                                    <option value="own_apartment">Own an apartment</option>
                                    <option value="rent_house">Renting a house</option>
                                    <option value="own_house">Own a house</option>
                                </select>
                            </div>

                            <div className="mt-3">
                                <label className="block text-sm font-medium">Your free time per week</label>
                                <select
                                    name="freeTime"
                                    value={formData.freeTime}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                                >
                                    <option value="">Select free time</option>
                                    <option value="less_than_5">Less than 5 hours</option>
                                    <option value="5_10">5–10 hours</option>
                                    <option value="10_20">10–20 hours</option>
                                    <option value="20_plus">More than 20 hours</option>
                                </select>
                            </div>

                            <div className="mt-3">
                                <label className="block text-sm font-medium">Your experience with pets</label>
                                <select
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                                >
                                    <option value="">Select experience level</option>
                                    <option value="none">No experience</option>
                                    <option value="some">Some experience</option>
                                    <option value="experienced">Experienced pet owner</option>
                                </select>
                            </div>

                            <div className="mt-3">
                                <label className="block text-sm font-medium">Do you have children?</label>
                                <select
                                    name="kids"
                                    value={formData.kids}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                                >
                                    <option value="">Select one</option>
                                    <option value="no">No</option>
                                    <option value="yes_under_5">Yes, under 5 years old</option>
                                    <option value="yes_over_5">Yes, over 5 years old</option>
                                    <option value="yes_mixed">Yes, mixed ages</option>
                                </select>
                            </div>
                        </form>
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={handleClear}>
                            Clear All
                        </Button>
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            loadingText="Applying..."
                        >
                            Apply Filters
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default DrawerFilter;