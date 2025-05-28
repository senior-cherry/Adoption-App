import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/utils/connect";

type Params = {
    params: {
        id: string;
    }
}

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
    const { id } = params;

    try {
        const body = await req.json();

        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            return new NextResponse(JSON.stringify({ message: 'Category not found' }), { status: 404 });
        }

        const oldSlug = existingCategory.slug;
        const newSlug = body.slug;

        if (newSlug !== oldSlug) {
            const slugExists = await prisma.category.findUnique({
                where: { slug: newSlug }
            });

            if (slugExists) {
                return new NextResponse(JSON.stringify({ message: 'Slug already exists' }), { status: 400 });
            }
        }

        const updatedCategory = await prisma.$transaction(async (tx) => {
            const updated = await tx.category.update({
                where: { id },
                data: {
                    name: body.name,
                    engName: body.engName || null,
                    description: body.description || null,
                    engDescription: body.engDescription || null,
                    slug: body.slug,
                },
            });

            if (newSlug && newSlug !== oldSlug) {
                const categoryExists = await tx.category.findUnique({
                    where: { slug: newSlug }
                });

                if (categoryExists) {
                    await tx.pet.updateMany({
                        where: { catSlug: oldSlug },
                        data: { catSlug: newSlug },
                    });
                } else {
                    throw new Error('Failed to create category with new slug');
                }
            }
            return updated;
        });

        return new NextResponse(JSON.stringify(updatedCategory), { status: 200 });

    } catch (err) {
        return new NextResponse(JSON.stringify({message: 'Something went wrong!'}), { status: 500 });
    }
};

export async function DELETE(request: NextRequest, { params }: Params) {
    const id = params.id;
    const fallbackSlug = "not-defined";

    try {
        const result = await prisma.$transaction(async (tx) => {
            const categoryToDelete = await tx.category.findUnique({
                where: { id }
            });

            if (!categoryToDelete) {
                throw new Error("Category not found");
            }

            if (categoryToDelete.slug === fallbackSlug) {
                throw new Error("Cannot delete fallback category");
            }

            let fallbackCategory = await tx.category.findUnique({
                where: { slug: fallbackSlug }
            });

            if (!fallbackCategory) {
                fallbackCategory = await tx.category.create({
                    data: {
                        name: "Не визначено",
                        slug: fallbackSlug,
                        description: "Запасний варіант категорії для тварин",
                        engName: "Not Defined",
                        engDescription: "Default category for unassigned pets",
                    },
                });
            }

            await tx.pet.updateMany({
                where: { catSlug: categoryToDelete.slug },
                data: { catSlug: fallbackSlug },
            });

            await tx.category.delete({
                where: { id },
            });

            return { success: true };
        });

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        return NextResponse.json({message: 'Something went wrong!'}, {status: 500});
    }
}