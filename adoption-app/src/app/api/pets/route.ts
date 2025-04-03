import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";
export const GET = async (req: NextRequest) => {

    const { searchParams } = new URL(req.url);
    const cat = searchParams.get("cat");

    try {
        const pets = await prisma.pet.findMany({
            where: {
                ...(cat ? {catSlug: cat} : {isFeatured: true})
            }
        });
        return new NextResponse(
            JSON.stringify(pets),
            { status: 200 }
        )
    } catch (err) {
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        )
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const pet = await prisma.pet.create({
            data: body
        });
        return new NextResponse(JSON.stringify(pet), { status: 201 })
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 })
    }
}