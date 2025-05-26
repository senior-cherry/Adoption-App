"use client";
import { useEffect, useState } from "react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Checkbox,
    Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {useLocale} from "next-intl";

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    onChange: (selected: string[]) => void;
    selectedCategories: string[];
}

const CategoryDropdown = ({ onChange, selectedCategories }: Props) => {
    const locale = useLocale();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/categories', {
                    cache: 'no-store'
                });

                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleOption = (option: string) => {
        const updatedOptions = selectedCategories.includes(option)
            ? selectedCategories.filter((o) => o !== option)
            : [...selectedCategories, option];

        onChange(updatedOptions);
    };

    const getButtonText = () => {
        if (isLoading) return locale === 'uk' ? "Завантаження..." : "Loading...";
        if (selectedCategories.length === 0) return locale === 'uk' ? "Оберіть категорії" : "Select categories";
        if (selectedCategories.length === 1) {
            const selected = categories.find(c => c.slug === selectedCategories[0]);
            return selected ? (locale === 'uk' ? selected.name : selected.engName) : (locale === 'uk' ? "1 категорія" : "1 category");
        }
        return locale === 'uk' ? `${selectedCategories.length} категорій` : `${selectedCategories.length} categories`;
    };

    return (
        <Menu closeOnSelect={false}>
            <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                isLoading={isLoading}
                w="full"
            >
                {getButtonText()}
            </MenuButton>
            <MenuList>
                {categories.length === 0 && !isLoading ? (
                    <MenuItem>{locale === 'uk' ? "Категорій не знайдено" : "No categories found"}</MenuItem>
                ) : (
                    categories.map((category) => (
                        <MenuItem key={category.id} onClick={() => toggleOption(category.slug)}>
                            <Checkbox
                                isChecked={selectedCategories.includes(category.slug)}
                                pointerEvents="none"
                            >
                                {locale === 'uk' ? category.name : category.engName}
                            </Checkbox>
                        </MenuItem>
                    ))
                )}
            </MenuList>
        </Menu>
    );
};

export default CategoryDropdown;