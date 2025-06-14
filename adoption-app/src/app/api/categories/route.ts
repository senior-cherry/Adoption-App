import {NextRequest, NextResponse} from "next/server";
import {prisma} from "../../../../lib/prisma";

export const GET = async () => {
    try {
        const categories = await prisma.category.findMany();
        return new NextResponse(JSON.stringify(categories), { status: 200 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const category = await prisma.category.create({
            data: body
        });
        return new NextResponse(JSON.stringify(category), { status: 201 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}