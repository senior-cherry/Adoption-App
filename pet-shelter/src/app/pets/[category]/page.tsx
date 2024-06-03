import {PetType} from "@/types/types";
import PetLayout from "@/app/layouts/PetLayout";
import {Card, CardBody, CardFooter} from "@chakra-ui/card";
import {Button, ButtonGroup, Divider, Grid, Heading, Image, Stack, Text} from "@chakra-ui/react";
import Link from "next/link";
import AdoptButtonGroup from "@/app/components/AdoptButtonGroup";

const getData = async (category: string) => {
    const res = await fetch(`/api/pets?cat=${category}`, {
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
            <main className="mt-12">
                <Grid className="pet-grid" gap={6}>
                    {pets.map((pet) => {
                        return (
                            <Card maxW='sm' key={pet.id}>
                                <CardBody>
                                    <Image
                                        src={`/uploads/${pet.imageUrl}`}
                                        alt={pet.imageUrl}
                                        borderRadius='lg'
                                        height="400"
                                        width="100%"
                                    />
                                    <Stack mt='6' spacing='3'>
                                        <Link href={`/pets/pet/${pet.id}`} className="hover:text-orange-500">
                                            <Heading size='md'>{pet.name}</Heading>
                                        </Link>
                                        <Text>
                                            {pet.species}
                                        </Text>
                                        <Text>
                                            {pet.gender}
                                        </Text>
                                        <Text color='blue.600' fontSize='2xl'>
                                            {pet.age}
                                        </Text>
                                    </Stack>
                                </CardBody>
                                <Divider />
                                <CardFooter>
                                    <ButtonGroup spacing='2'>
                                        <AdoptButtonGroup pet={pet.name} imageUrl={pet.imageUrl} />
                                        <Link href={`/pets/pet/${pet.id}`} className="details_link">
                                            <Button variant='ghost' colorScheme='blue'>
                                                Дізнатись більше
                                            </Button>
                                        </Link>
                                    </ButtonGroup>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </Grid>
            </main>
        </PetLayout>
    );
};

export default PetsByCategory;