import {Card, CardBody, CardFooter} from "@chakra-ui/card";
import {Button, ButtonGroup, Divider, Heading, Image, Stack, Text} from "@chakra-ui/react";
import AdoptButtonGroup from "@/components/AdoptButtonGroup";
import Link from "next/link";

type CardProps = {
        pet: {
            id: string;
            imageUrl: string;
            name: string;
            species: string;
            gender: string;
            age: string;
        }
}

const CardComponent = ({pet}: CardProps) => {
    return (
        <Card w="sm">
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
                    <AdoptButtonGroup pet_id={pet.id} imageUrl={pet.imageUrl} species={pet.species} />
                    <Link href={`/pets/pet/${pet.id}`} className="details_link">
                        <Button variant='ghost' colorScheme='blue'>
                            Дізнатись більше
                        </Button>
                    </Link>
                </ButtonGroup>
            </CardFooter>
        </Card>
    );
}

export default CardComponent;