import {NextRequest, NextResponse} from "next/server";
import {prisma} from "../../../../lib/prisma";

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "8", 10);
    const skip = (page - 1) * limit;

    try {
        const posts = await prisma.post.findMany();
        const paginated = posts.slice(skip, skip + limit);

        return NextResponse.json({
            posts: paginated,
            totalCount: posts.length,
        });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const post = await prisma.post.create({
            data: body
        });
        return new NextResponse(JSON.stringify(post), { status: 201 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}