import {NextRequest, NextResponse} from "next/server";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";
import {prisma} from "@/utils/connect";

export const GET = async (req: NextRequest, {params}: Params) => {
    const id = params.id;

    try {
        const category = await prisma.category.findUnique({where: {id}});
        return new NextResponse(
            JSON.stringify(category),
            { status: 200 }
        )
    } catch (err) {
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        )
    }
}

export const PATCH = async (req: NextRequest, { params }: Params) => {
    const id = params.id;

    try {
        const body = await req.json();
        const category = await prisma.category.update({
            where: {id},
            data: body
        });
        return new NextResponse(JSON.stringify(category), { status: 201 })
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 })
    }
}

export async function DELETE(request: NextRequest, {params}: Params) {
    const id = params.id;

    const category = await prisma.category.delete({
        where: {id}
    })
    return NextResponse.json(request);
}