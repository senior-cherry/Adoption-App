import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";

export const GET = async () => {
    try {
        const posts = await prisma.post.findMany();
        return new NextResponse(
            JSON.stringify(posts),
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
        const post = await prisma.post.create({
            data: body
        });
        return new NextResponse(JSON.stringify(post), { status: 201 })
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 })
    }
}