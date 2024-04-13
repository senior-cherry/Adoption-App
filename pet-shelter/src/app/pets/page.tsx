import {Prisma, PrismaClient, PrismaPromise} from '@prisma/client';
import {DefaultArgs, GetFindResult} from "@prisma/client/runtime/library";
import Link from "next/link";
import Pet from "@/app/components/Pet";
import {any} from "prop-types";

const prisma = new PrismaClient();

async function getPets(): Promise<PrismaPromise<GetFindResult<Prisma.$PetPayload<DefaultArgs>, {}>[]>> {
    return prisma.pet.findMany({
        include: {
            category: {
                select: {name: true}
            }
        }
    });
}

// @ts-ignore
async function getPetsByCategory(category): Promise<PrismaPromise<GetFindResult<Prisma.$PetPayload<DefaultArgs>, {}>[]>> {
    return prisma.pet.findMany({
        where: category
    });
}

async function getCategories() {
    return prisma.category.findMany();
}

const Pets = async () => {
    const pets = await getPets();
    const categories = await getCategories();
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Link href={'/addPet'}>Add Pet</Link>
            {categories.map((category: any) => {
                return (
                    <p onClick={getPetsByCategory(category.name)}>{category.name}</p>
                );
            })}
            <h1>Pets</h1>
            {pets.map((pet) => {
                return (
                    <Pet id={pet.id} name={pet.name} species={pet.species} age={pet.age} skills={pet.skills} categoryName={pet.category.name} key={pet.id} />
                );
            })}
        </main>
    );
}

export default Pets;