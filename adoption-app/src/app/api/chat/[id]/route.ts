import {prisma} from "@/utils/connect";
import {NextRequest, NextResponse} from "next/server";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";

export async function DELETE(request: NextRequest, { params }: Params) {
    const id = params.id;

    try {
        const chat = await prisma.chat.delete({
            where: { id }
        });
        return NextResponse.json(JSON.stringify(chat), { status: 200 });
    } catch (e) {
        return NextResponse.json(JSON.stringify({ message: 'Something went wrong!' }), { status: 500 });
    }
}