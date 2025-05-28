import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";

type Params = {
    params: {
        id: string;
    }
}

export const GET = async (req: NextRequest, {params}: Params) => {
    const id = params.id;

    try {
        const post = await prisma.post.findUnique({where: {id}});
        return new NextResponse(JSON.stringify(post), { status: 200 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

export const PATCH = async (req: NextRequest, { params }: Params) => {
    const id = params.id;

    try {
        const body = await req.json();
        const post = await prisma.post.update({
            where: {id},
            data: body
        });
        return new NextResponse(JSON.stringify(post), { status: 201 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

export async function DELETE(request: NextRequest, {params}: Params) {
    const id = params.id;

    try {
        const post = await prisma.post.delete({
            where: {id}
        });
        return NextResponse(JSON.stringify(post), { status: 200 });
    } catch (e) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }

}