import {PetType} from "@/types/types";
import PetLayout from "@/app/layouts/PetLayout";
import {Center, Grid} from "@chakra-ui/react";
import CardComponent from "@/app/components/CardComponent";

const getData = async (category: string) => {
    const res = await fetch(`${process.env.BASE_URL}/api/pets?cat=${category}`, {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

type Props = {
    params: {category: string}
}

const PetsByCategory = async ({params}: Props) => {
    const pets: PetType[] = await getData(params.category);
    return (
        <PetLayout>
            <Center>
                <Grid gap={10} className="pet-grid">
                    {pets.map((pet) => {
                        return (
                            <CardComponent pet={pet} />
                        );
                    })}
                </Grid>
            </Center>
        </PetLayout>
    );
};

export default PetsByCategory;