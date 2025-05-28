import {Card, CardBody, CardFooter} from "@chakra-ui/card";
import {Button, ButtonGroup, Divider, Heading, Image, Stack, Text} from "@chakra-ui/react";
import AdoptButtonGroup from "@/components/AdoptButtonGroup";
import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";

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

const CardComponent = ({pet}: CardProps, key: string) => {
    const locale = useLocale();
    const t = useTranslations("adoptBtnGroup");
    return (
        <Card w="sm" key={key}>
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
                        <Heading size='md'>{locale === 'uk' ? pet.name : pet.engName}</Heading>
                    </Link>
                    <Text>
                        {locale === 'uk' ? pet.species : pet.engSpecies}
                    </Text>
                    <Text>
                        {locale === 'uk' ? pet.gender : pet.engGender}
                    </Text>
                    <Text color='blue.600' fontSize='2xl'>
                        {locale === 'uk' ? pet.age : pet.engAge}
                    </Text>
                </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
                <ButtonGroup className="flex justify-between w-full">
                    <AdoptButtonGroup pet_id={pet.id} imageUrl={pet.imageUrl} species={locale === 'uk' ? pet.species : pet.engSpecies} />
                    <Link href={`/pets/pet/${pet.id}`} className="details_link">
                        <Button variant='ghost' colorScheme='blue'>
                            {t("moreInfoBtn")}
                        </Button>
                    </Link>
                </ButtonGroup>
            </CardFooter>
        </Card>
    );
}

export default CardComponent;