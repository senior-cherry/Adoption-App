import {prisma} from "@/utils/connect";
import {NextRequest, NextResponse} from "next/server";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";

export async function DELETE(request: NextRequest, { params }: Params) {
    const id = params.id;

    const chat = await prisma.chat.delete({
        where: { id }
    })
    return NextResponse.json(request);
}