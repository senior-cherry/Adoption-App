import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const petId = searchParams.get("petId");

    if (!userId || !petId) {
        return new NextResponse(JSON.stringify({ message: "Missing parameters" }), { status: 400 });
    }

    const existing = await prisma.adoption.findFirst({
        where: {
            user_id: userId,
            pet_id: petId,
            approval: "inProcess"
        }
    });

    return NextResponse.json({ exists: !!existing });
};
