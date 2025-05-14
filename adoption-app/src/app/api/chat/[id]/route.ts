import {prisma} from "@/utils/connect";
import {NextRequest, NextResponse} from "next/server";

type Params = {
    id: string;
}

export async function DELETE(request: NextRequest, { params }: Params) {
    const id = params.id;

    try {
        await prisma.chat.delete({
            where: { id }
        });
        return NextResponse.json(JSON.stringify({}), { status: 204 });
    } catch (e) {
        return NextResponse.json(JSON.stringify({ message: 'Something went wrong!' }), { status: 500 });
    }
}