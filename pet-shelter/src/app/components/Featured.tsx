import {PetType} from "@/types/types";
import {Card, CardBody, CardFooter} from "@chakra-ui/card";
import {Button, ButtonGroup, Divider, Heading, Stack, Text, Image} from "@chakra-ui/react";


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
        <main className="pet">
            <div>
                {featuredPets.map((pet) => {
                    return (
                        <Card maxW='sm'>
                            <CardBody>
                                <Image
                                    src={`/uploads/${pet.imageUrl}`}
                                    alt={pet.imageUrl}
                                    borderRadius='lg'
                                />
                                <Stack mt='6' spacing='3'>
                                    <Heading size='md'>{pet.name}</Heading>
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
                                        Buy now
                                    </Button>
                                    <Button variant='ghost' colorScheme='blue'>
                                        Add to cart
                                    </Button>
                                </ButtonGroup>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </main>
    );
}

export default Featured;