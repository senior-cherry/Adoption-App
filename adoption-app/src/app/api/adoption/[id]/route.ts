import {NextRequest, NextResponse} from "next/server";
import { prisma } from "../../../../../lib/prisma";
import {sendEmail} from "@/actions/sendEmailMessage";

type Params = {
    params: {
        id: string;
    }
}

export const PATCH = async (req: NextRequest, { params }: Params) => {
    const id = params.id;

    try {
        const { decision, email } = await req.json();
        const adoptionRequest = await prisma.adoption.update({
            where: {id},
            data: {
                approval: decision,
                archivedAt: new Date()
            }
        });

        const result = await sendEmail(email, decision);

        if (!result.success) {
            return new NextResponse(JSON.stringify({ message: "Failed to send email" }), { status: 500 })
        }

        return new NextResponse(JSON.stringify(adoptionRequest), { status: 200 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

