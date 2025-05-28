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
import { useTranslations } from 'next-intl';

const DrawerFilter = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const toast = useToast();

    const t = useTranslations('drawer-filter');
    const tf = useTranslations('filter-form');

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
                        title: t('toastTitle'),
                        description: t('toastDescription'),
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
                title: t('errorTitle'),
                description: t('errorDescription'),
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
                {t('filterBtn')}
            </Button>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>{t('drawerHeader')}</DrawerHeader>
                    <DrawerBody>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <p className="font-medium mb-2">{t('categories')}</p>
                                <CategoryDropdown
                                    onChange={handleCategoriesChange}
                                    selectedCategories={selectedCategories}
                                />
                            </div>

                            <hr className="my-4" />

                            <p className="font-medium mb-3">{t('drawerText')}</p>

                            <div className="mt-3">
                                <label className="block text-sm font-medium">{tf('income.label')}</label>
                                <select
                                    name="income"
                                    value={formData.income}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                                >
                                    <option value="">{tf('income.placeholder')}</option>
                                    <option value="under_1000">{tf('income.under_1000')}</option>
                                    <option value="1000_3000">{tf('income.1000_3000')}</option>
                                    <option value="3000_5000">{tf('income.3000_5000')}</option>
                                    <option value="over_5000">{tf('income.over_5000')}</option>
                                </select>
                            </div>

                            <div className="mt-3">
                                <label className="block text-sm font-medium">{tf('space.label')}</label>
                                <select
                                    name="space"
                                    value={formData.space}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                                >
                                    <option value="">{tf('space.placeholder')}</option>
                                    <option value="rent_apartment">{tf('space.rent_apartment')}</option>
                                    <option value="own_apartment">{tf('space.own_apartment')}</option>
                                    <option value="rent_house">{tf('space.rent_house')}</option>
                                    <option value="own_house">{tf('space.own_house')}</option>
                                </select>
                            </div>

                            <div className="mt-3">
                                <label className="block text-sm font-medium">{tf('freeTime.label')}</label>
                                <select
                                    name="freeTime"
                                    value={formData.freeTime}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                                >
                                    <option value="">{tf('freeTime.placeholder')}</option>
                                    <option value="less_than_5">{tf('freeTime.less_than_5')}</option>
                                    <option value="5_10">{tf('freeTime.5_10')}</option>
                                    <option value="10_20">{tf('freeTime.10_20')}</option>
                                    <option value="20_plus">{tf('freeTime.20_plus')}</option>
                                </select>
                            </div>

                            <div className="mt-3">
                                <label className="block text-sm font-medium">{tf('experience.label')}</label>
                                <select
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                                >
                                    <option value="">{tf('experience.placeholder')}</option>
                                    <option value="none">{tf('experience.none')}</option>
                                    <option value="some">{tf('experience.some')}</option>
                                    <option value="experienced">{tf('experience.experienced')}</option>
                                </select>
                            </div>

                            <div className="mt-3">
                                <label className="block text-sm font-medium">{tf('kids.label')}</label>
                                <select
                                    name="kids"
                                    value={formData.kids}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-1 text-gray-800 rounded bg-gray-200 focus:outline-none"
                                >
                                    <option value="">{tf('kids.placeholder')}</option>
                                    <option value="no">{tf('kids.no')}</option>
                                    <option value="yes_under_5">{tf('kids.yes_under_5')}</option>
                                    <option value="yes_over_5">{tf('kids.yes_over_5')}</option>
                                    <option value="yes_mixed">{tf('kids.yes_mixed')}</option>
                                </select>
                            </div>
                        </form>
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={handleClear}>
                            {t('clearBtn')}
                        </Button>
                        <Button variant="outline" mr={3} onClick={onClose}>
                            {t('cancelBtn')}
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            loadingText={t('loadingText')}
                        >
                            {t('applyBtn')}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default DrawerFilter;