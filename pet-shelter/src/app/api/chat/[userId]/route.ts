import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/connect";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export const GET = async (req: NextRequest, { params }: Params) => {
    try {
        const chats = await prisma.chat.findMany({
            where: { user_id: params.userId },
            orderBy: { created_at: 'desc' },
            select: { id: true, name: true },
        });
        return new NextResponse(
            JSON.stringify(chats),
            { status: 200 }
        )
    } catch (err) {
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        )
    }
}
