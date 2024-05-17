import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";

export const GET = async () => {
    try {
        const adoptions = await prisma.adoption.findMany();
        return new NextResponse(
            JSON.stringify(adoptions),
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
        const adoption = await prisma.adoption.create({
            data: body
        });
        return new NextResponse(JSON.stringify(adoption), { status: 201 })
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 })
    }
}