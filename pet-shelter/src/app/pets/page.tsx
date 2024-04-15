import {Prisma, PrismaClient, PrismaPromise} from '@prisma/client';
import {DefaultArgs, GetFindResult} from "@prisma/client/runtime/library";
import Link from "next/link";
import Pet from "@/app/components/Pet";
import PetLayout from "@/app/layouts/PetLayout";

const prisma = new PrismaClient();

let pets: any;

async function getPets(category: any): Promise<{}> {
    if (category === "All") {
        pets = prisma.pet.findMany({
            include: {
                category: {
                    select: {name: true}
                }
            }
        });
        return pets;
    } else {
        pets = await prisma.pet.findMany({
            include: {
                category: {
                    select: { name: true },
                }
            },
            where: {
                category: {
                    name: category
                }
            }
        });
        return pets;
    }
}

async function getCategories() {
    return prisma.category.findMany();
}

export default async function Home() {
    const categories = await getCategories();

    return (
       <PetLayout>
            <Link href={'/addPet'}>Add Pet</Link>
            <h1>Pets</h1>
           {categories.map((c) => {
               return (
                   <button onClick={() => getPets(c.name)}>{c.name}</button>
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
                        key={pet.id} />
                );
            })}
       </PetLayout>
    );
}


