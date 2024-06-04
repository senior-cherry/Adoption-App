import {PetType} from "@/types/types";
import {Card, CardBody, CardFooter} from "@chakra-ui/card";
import {Button, ButtonGroup, Divider, Heading, Stack, Text, Image, useToast} from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react"
import Link from "next/link";
import AdoptButtonGroup from "@/app/components/AdoptButtonGroup";


const getData = async () => {
    const res = await fetch(`${process.env.PRODUCTION_URL}/api/pets`, {
        cache: "no-store"
    })

    return res.json();
}

const Featured = async () => {
    const featuredPets: PetType[] = await getData();

    return (
        <main className="mt-12">
            <Grid gap={6} className="pet-grid">
                {featuredPets.map((pet) => {
                    return (
                        <Card width="80%" key={pet.id}>
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
    );
}

export default Featured;