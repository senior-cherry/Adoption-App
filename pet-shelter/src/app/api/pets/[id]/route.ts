import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";
export const GET = async (req: NextRequest, {params}: Params) => {
    const id = params.id;

    try {
        const pet = await prisma.pet.findUnique({where: {id}});
        return new NextResponse(
            JSON.stringify(pet),
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
        const pet = await prisma.pet.update({
            where: {id},
            data: body
        });
        return new NextResponse(JSON.stringify(pet), { status: 201 })
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 })
    }
}

export async function DELETE(request: NextRequest, {params}: Params) {
    const id = params.id;

    const pet = await prisma.pet.delete({
        where: {id}
    })
    return NextResponse.json(request);
}