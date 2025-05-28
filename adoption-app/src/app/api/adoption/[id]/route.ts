import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";

type Params = {
    params: {
        id: string;
    }
}

export const PATCH = async (req: NextRequest, { params }: Params) => {
    const id = params.id;

    try {
        const body = await req.json();
        const adoptionRequest = await prisma.adoption.update({
            where: {id},
            data: {
                approval: body,
                archivedAt: new Date()
            }
        });
        return new NextResponse(JSON.stringify(adoptionRequest), { status: 201 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

