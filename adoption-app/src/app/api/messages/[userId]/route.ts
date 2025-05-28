import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";

type Params = {
    params: {
        userId: string;
    }
}

export const GET = async (req: NextRequest, {params}: Params) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                user_id: params.userId,
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        return new NextResponse(JSON.stringify(messages), { status: 200 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}
