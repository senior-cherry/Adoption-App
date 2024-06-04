import Link from "next/link";
import {CategoryType} from "@/types/types";
import { headers } from 'next/headers';
import {Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";

const getCategories = async () => {
    const res = await fetch(`${process.env.PRODUCTION_URL}/api/categories`, {
        cache: "no-store"
    })

    return res.json();
}

const Filter = async () => {
    const categories: CategoryType[] = await getCategories();
    const headersList = headers();

    let url = headersList.get('next-url');

    return (
        <div className="m-6">
            <div className="filter_menu">
                <Link href='/pets' className={`w-full h-1/3 bg-cover p-8 md:h-1/2 ${url === '/pets' ? 'active' : ''}`}>Всі</Link>
                {categories.map((category: CategoryType) => {
                    return (
                        <Link
                            href={`/pets/${category.name}`}
                            key={category.id}
                            className={`w-full h-1/3 bg-cover p-8 md:h-1/2 ${url === `/pets/${category.name}`
                                ? 'active' : ''}`}>
                            {category.name}
                        </Link>
                    );
                })}
            </div>
            <div>
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
        </div>
    );
}

export default Filter;

