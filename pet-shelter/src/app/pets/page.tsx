import {PrismaClient} from '@prisma/client';
import Link from "next/link";
import Pet from "@/app/components/Pet";
import PetLayout from "@/app/layouts/PetLayout";
import { cookies } from "next/headers";

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

export async function getCategories() {
    return prisma.category.findMany();
}

export default async function Pets() {
    const categories = await getCategories();
    let pets = await getPets();

    return (
       <PetLayout>
            <Link href={'/addPet'}>Add Pet</Link>
            <h1>Pets</h1>
           <Link href='/pets'>All</Link>
           {categories.map((c) => {
               return (
                   <Link href={`/pets/${c.name}`}>{c.name}</Link>
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
       </PetLayout>
    );
}


