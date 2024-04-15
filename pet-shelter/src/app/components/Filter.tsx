'use client';
import prisma from "../../../lib/prisma";
import {useRouter} from "next/navigation";

const Filter = async () => {
    const getCategories = async () => {
        return prisma.category.findMany();
    }

    const categories = await getCategories();
    const router = useRouter();
    const handleRouteUpdate = async (category: any) => {
        router.push(`/pets/${category}`)
    }

    return (
        <div>
            {categories.map((category) => {
                return (
                    <button onClick={() => handleRouteUpdate(category.name)}>{category.name}</button>
                )
            })}
        </div>
    );
}

export default Filter;