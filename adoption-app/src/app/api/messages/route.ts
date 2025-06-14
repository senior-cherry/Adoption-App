import {NextRequest, NextResponse} from "next/server";
import {prisma} from "../../../../lib/prisma";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const message = await prisma.message.create({
            data: body
        });
        return new NextResponse(JSON.stringify(message), { status: 201 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}