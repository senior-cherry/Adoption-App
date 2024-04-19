import {PrismaClient} from '@prisma/client';
import Link from "next/link";
import Pet from "@/app/components/Pet";
import { cookies } from "next/headers";
import {Category} from "@/types/types";

const prisma = new PrismaClient();

async function getPets(): Promise<{}> {
    return prisma.pet.findMany({
            include: {
                category: {
                    select: {name: true}
                }
            }
        });
}

const getCategories = async () => {
    const res = await fetch("http://localhost:3000/api/categories", {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed!");
    }

    return res.json();
}

export default async function Pets() {
    const categories: Category = await getCategories();
    let pets = await getPets();

    return (
        <main>
            <Link href={'/addPet'}>Add Pet</Link>
            <h1>Pets</h1>
           <Link href='/pets'>All</Link>
           {categories.map((category) => {
               return (
                   <Link
                       href={`/pets/${category.name}`}
                       key={category.id}
                       className="w-full h-1/3 bg-cover p-8 md:h-1/2">
                       {category.name}
                   </Link>
               );
           })}
            {pets && pets.map((pet: any) => {
                return (
                    <Pet
                        id={pet.id}
                        name={pet.name}
                        species={pet.species}
                        age={pet.age}
                        skills={pet.skills}
                        categoryName={pet.category.name}
                    />
                );
            })}
        </main>
    );
}


