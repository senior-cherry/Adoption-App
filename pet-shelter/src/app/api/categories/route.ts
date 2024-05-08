import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";

export const GET = async () => {
    try {
        const categories = await prisma.category.findMany();
        return new NextResponse(
            JSON.stringify(categories),
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
        const pet = await prisma.category.create({
            data: body
        });
        return new NextResponse(JSON.stringify(pet), { status: 201 })
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 })
    }
}