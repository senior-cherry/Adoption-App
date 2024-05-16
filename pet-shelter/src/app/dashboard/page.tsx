"use client";
import {useSession, useUser} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";
import {redirect, useRouter} from "next/navigation";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon, Box, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Image, ButtonGroup, Button
} from '@chakra-ui/react';
import {PetType} from "@/types/types";
import {useEffect, useState} from "react";
import Link from "next/link";
import DeleteButton from "@/app/components/DeleteButton";

const getData = async (collection: String) => {
    const res = await fetch(`http://localhost:3000/api/${collection}`, {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

const Dashboard = () => {
    const {session} = useSession();
    const {isLoaded, user}  = useUser();
    const userRole = checkUserRole(session);
    const [pets, setPets] = useState<PetType[]>([]);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const petsData = await getData("pets");
                setPets(petsData);
            } catch (error) {
                console.error("Error fetching pets:", error);
            }
        };

        if (isLoaded && userRole !== "org:admin") {
            redirect("/");
        } else {
            fetchData();
        }
    }, [isLoaded, userRole])

    const handleDelete = async (petId: string) => {
        try {
            await fetch(`/api/pets/${petId}`, {
                method: 'DELETE'
            })
            router.refresh();
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Accordion>
            <AccordionItem>
                <h2>
                    <AccordionButton>
                        <Box as='span' flex='1' textAlign='left'>
                            Домашні улюбленці
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>База тварин у притулку</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Фото</Th>
                                    <Th>Ім'я</Th>
                                    <Th>Вид</Th>
                                    <Th>Вік</Th>
                                    <Th>Категорія</Th>
                                    <Th>Дії</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {pets.map((pet) => {
                                    return (
                                        <Tr>
                                            <Td>
                                                <Image
                                                    borderRadius='full'
                                                    boxSize='40px'
                                                    src={`/uploads/${pet.imageUrl}`}
                                                    alt={pet.name}
                                                />
                                            </Td>
                                            <Td>{pet.name}</Td>
                                            <Td>{pet.species}</Td>
                                            <Td>{pet.age}</Td>
                                            <Td>{pet.catSlug}</Td>
                                            <Td>
                                                <ButtonGroup gap='4'>
                                                    <Link href={`/pets/update/${pet.id}`}>
                                                        <Button colorScheme='orange'>Оновити</Button>
                                                    </Link>
                                                    <DeleteButton id={pet.id} />
                                                </ButtonGroup>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
                <h2>
                    <AccordionButton>
                        <Box as='span' flex='1' textAlign='left'>
                            Категорії
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
                <h2>
                    <AccordionButton>
                        <Box as='span' flex='1' textAlign='left'>
                            Статті
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}

export default Dashboard;