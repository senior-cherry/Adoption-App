import PetLayout from "@/app/layouts/PetLayout";
import {PetType} from "@/types/types";
import { Grid, Center } from "@chakra-ui/react"
import CardComponent from "@/components/CardComponent";

const getData = async () => {
    const res = await fetch(`${process.env.BASE_URL}/api/pets`, {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

export default async function Pets() {
    const featuredPets: PetType = await getData();
    return (
            <PetLayout>
                <Center>
                <Grid gap={10} className="pet-grid">
                    {featuredPets.map((pet) => {
                        return (
                            <CardComponent pet={pet} />
                        );
                    })}
                </Grid>
                </Center>
            </PetLayout>
    );
}


