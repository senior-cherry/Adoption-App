import { CategoryType } from "@/types/types";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import CategoryLink from "@/app/components/CategoryLink";
import Link from "next/link";

const getCategories = async (): Promise<CategoryType[]> => {
    const res = await fetch(`${process.env.BASE_URL}/api/categories`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    return res.json();
};

const Filter = async () => {
    const categories = await getCategories();

    return (
        <div className="mx-6 mt-8 mb-6">
            <div className="filter_menu">
                <CategoryLink href="/pets">Всі</CategoryLink>
                {categories.map((category) => (
                    <CategoryLink key={category.id} href={`/pets/${encodeURIComponent(category.name)}`}>
                        {category.name}
                    </CategoryLink>
                ))}
            </div>

            <div className="filter_menu_mb_tb">
                <Menu>
                    <MenuButton as={Button} colorScheme={"teal"}>
                        Категорія
                    </MenuButton>
                    <MenuList>
                        <Link href='/pets'>
                            <MenuItem>Всі</MenuItem>
                        </Link>
                        {categories.map((category: CategoryType) => {
                            return (
                                <Link
                                    href={`/pets/${category.name}`}
                                    key={category.id}
                                >
                                    <MenuItem>{category.name}</MenuItem>
                                </Link>
                            );
                        })}
                    </MenuList>
                </Menu>
            </div>
        </div>
    );
};

export default Filter;
