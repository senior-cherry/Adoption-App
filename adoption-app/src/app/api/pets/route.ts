import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/connect";

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const cat = searchParams.get("cat");
    const recommended = searchParams.get("recommended");
    const isAdmin = searchParams.get("admin") === "true";

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "8", 10);
    const skip = (page - 1) * limit;

    try {
        if (recommended) {
            const petIds = recommended.split(",");

            let pets = await prisma.pet.findMany({
                where: {
                    id: { in: petIds },
                    ...(cat
                        ? {
                            catSlug: {
                                in: cat.split(","),
                            },
                        }
                        : {isFeatured: true}),
                },
                include: { category: true },
            });

            const sortedPets = petIds.map((id) => pets.find((pet) => pet.id === id)).filter(Boolean);

            const paginated = sortedPets.slice(skip, skip + limit);

            return NextResponse.json({
                pets: paginated,
                totalCount: sortedPets.length,
            });
        }

        const baseFilter = cat ? { catSlug: { in: cat.split(",") } } : { isFeatured: true };

        const [pets, totalCount] = await Promise.all([
            prisma.pet.findMany({
                where: baseFilter,
                ...(isAdmin ? {} : { skip, take: limit }),
                include: { category: true },
            }),
            prisma.pet.count({ where: baseFilter }),
        ]);

        return NextResponse.json({ pets, totalCount });
    } catch (err) {
        console.error("Error fetching pets:", err);
        return NextResponse.json(
            { message: "Something went wrong!" },
            { status: 500 }
        );
    }
};

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