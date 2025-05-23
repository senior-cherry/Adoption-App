import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/connect";

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const cat = searchParams.get("cat");
    const recommended = searchParams.get("recommended");

    try {
        if (recommended) {
            const petIds = recommended.split(',');

            const pets = await prisma.pet.findMany({
                where: {
                    id: {in: petIds},
                    ...(cat ? {
                        catSlug: {
                            in: cat.split(',')
                        }
                    } : {})
                },
                include: {
                    category: true
                }
            });

            const sortedPets = petIds.map(id =>
                pets.find(pet => pet.id === id)
            ).filter(Boolean);

            return NextResponse.json(sortedPets);
        }

        else if (cat) {
            const categorySlugs = cat.split(',');

            const pets = await prisma.pet.findMany({
                where: {
                    catSlug: {in: categorySlugs}
                },
                include: {
                    category: true
                }
            });

            return NextResponse.json(pets);
        }

        else {
            const pets = await prisma.pet.findMany({
                where: {
                    isFeatured: true
                },
                include: {
                    category: true
                }
            });

            return NextResponse.json(pets);
        }
    } catch (err) {
        console.error("Error fetching pets:", err);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const pet = await prisma.pet.create({
            data: body
        });
        return new NextResponse(JSON.stringify(pet), { status: 201 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}