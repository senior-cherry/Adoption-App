import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";
import {getTranslations} from "next-intl/server";

export const GET = async (req: NextRequest, {params}: Params) => {
    const id = params.id;

    try {
        const category = await prisma.category.findUnique({where: {id}});
        return new NextResponse(JSON.stringify(category), { status: 200 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
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
        return new NextResponse(JSON.stringify(category), { status: 201 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

export async function DELETE(request: NextRequest, {params}: Params) {
    const id = params.id;
    const fallbackSlug = "not-defined";
    const t = getTranslations("fallback-category");

    try {
        await prisma.$transaction(async (tx) => {
            const categoryToDelete = await tx.category.findUnique({
                where: {id}
            });

            if (!categoryToDelete) {
                throw new Error("Category not found");
            }

            if (categoryToDelete.slug === fallbackSlug) {
                throw new Error("Cannot delete fallback category");
            }

            const fallbackCategory = await tx.category.findUnique({
               where: {slug: fallbackSlug}
            });

            if (!fallbackCategory) {
                await tx.category.create({
                    data: {
                        name: (await t)("name"),
                        slug: fallbackSlug,
                        description: (await t)("description"),
                    },
                });
            }

            await tx.category.delete({
                where: { id },
            });
        })
        return NextResponse({ success: true });
    } catch (e) {
        return NextResponse(JSON.stringify({ message: 'Something went wrong!' }), { status: 500 });
    }
}