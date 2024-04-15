import prisma from "../../../../lib/prisma";
import PetLayout from "@/app/layouts/PetLayout";
import Pet from "@/app/components/Pet";

const PetsByCategory = async ({ params }: any) => {
    const { category } = params;

    const pets = await prisma.pet.findMany({
        include: {
            category: {
                select: { name: true },
            }
        },
        where: {
            category: {
                name: category
            }
        }
    });
    return (
        <PetLayout>
            <div>
                {pets.map((pet) => {
                    return (
                        <Pet id={pet.id}
                             name={pet.name}
                             species={pet.species}
                             age={pet.age}
                             skills={pet.skills}
                             categoryName={pet.category.name}
                             key={pet.id}
                        />
                    );
                })}
            </div>
        </PetLayout>
    );
};

export default PetsByCategory;