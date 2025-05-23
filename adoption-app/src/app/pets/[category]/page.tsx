import {Center, Grid} from "@chakra-ui/react";
import PetLayout from "@/layouts/PetLayout";
import CardComponent from "@/components/CardComponent";
import {PetType} from "@/types/types";

type Props = {
    params: {category: string}
}

const getData = async (category: string) => {
    const res = await fetch(`${process.env.BASE_URL}/api/pets?cat=${category}`, {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

const PetsByCategory = async ({params}: Props) => {
    const pets: PetType[] = await getData(params.category);
    return (
        <PetLayout>
            <Center>
                <Grid gap={10} className="pet-grid">
                    {pets.map((pet) => {
                        return (
                            <CardComponent pet={pet} key={pet.id} />
                        );
                    })}
                </Grid>
            </Center>
        </PetLayout>
    );
};

export default PetsByCategory;