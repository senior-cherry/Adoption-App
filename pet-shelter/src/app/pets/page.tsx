'use client';
import {Prisma, PrismaClient} from '@prisma/client';
import { DefaultArgs, GetFindResult } from '@prisma/client/runtime/library';
import Link from 'next/link';
import Pet from '@/app/components/Pet';
import { useState, useEffect } from 'react';

const prisma = new PrismaClient();

const getPetsByCategory = async (filter: string): Promise<GetFindResult<Prisma.$PetPayload<DefaultArgs>, {}>[]> => {
    if (filter === 'All') {
        return prisma.pet.findMany({
            include: {
                category: {
                    select: { name: true },
                },
            },
        });
    } else {
        return prisma.pet.findMany({
            include: {
                category: {
                    select: { name: true },
                },
            },
            where: {
                category: filter,
            },
        });
    }
};

const getCategories = async () => {
    return prisma.category.findMany();
};

export default function Pets() {
    const [pets, setPets] = useState<GetFindResult<Prisma.$PetPayload<DefaultArgs>, {}>[]>([]);
    const [filter, setFilter] = useState<string>('All');
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        async function fetchData() {
            const initialPets = await getPetsByCategory(filter);
            const categoryList = await getCategories();
            setPets(initialPets);
            setCategories(categoryList.map((category) => category.name));
        }
        fetchData();
    }, [filter]);

    const handleCategoryClick = async (category: string) => {
        setFilter(category);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Link href="/addPet">Add Pet</Link>
            {categories.map((category) => (
                <button onClick={() => handleCategoryClick(category)} key={category}>
                    {category}
                </button>
            ))}
            <h1>Pets</h1>
            {pets.map((pet) => (
                <Pet
                    id={pet.id}
                    name={pet.name}
                    species={pet.species}
                    age={pet.age}
                    skills={pet.skills}
                    categoryName={pet.category.name}
                    key={pet.id}
                />
            ))}
        </main>
    );
}
