import {PetType} from "@/types/types";
import {Card, CardBody, CardFooter} from "@chakra-ui/card";
import {Button, ButtonGroup, Divider, Heading, Stack, Text, Image} from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react"
import Link from "next/link";


const getData = async () => {
    const res = await fetch("http://localhost:3000/api/pets", {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

const Featured = async () => {
    const featuredPets: PetType = await getData();
    return (
        <main className="mt-12">
            <Grid templateColumns='repeat(4, 1fr)' gap={6}>
                {featuredPets.map((pet) => {
                    return (
                        <Card width="80%">
                            <CardBody>
                                <Image
                                    src={`/uploads/${pet.imageUrl}`}
                                    alt={pet.imageUrl}
                                    borderRadius='lg'
                                    height="400"
                                    width="100%"
                                />
                                <Stack mt='6' spacing='3'>
                                    <Link href={`/pets/${pet.id}`} className="hover:text-orange-500">
                                        <Heading size='md'>{pet.name}</Heading>
                                    </Link>
                                    <Text>
                                        {pet.species}
                                    </Text>
                                    <Text color='blue.600' fontSize='2xl'>
                                        {pet.age}
                                    </Text>
                                </Stack>
                            </CardBody>
                            <Divider />
                            <CardFooter>
                                <ButtonGroup spacing='2'>
                                    <Button variant='solid' colorScheme='blue'>
                                        Adopt now
                                    </Button>
                                    <Button variant='ghost' colorScheme='blue'>
                                        Add to favorites
                                    </Button>
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