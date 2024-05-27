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
import {AdoptionType, PetType, PostType} from "@/types/types";
import {useEffect, useState} from "react";
import Link from "next/link";
import DeleteButton from "@/app/components/DeleteButton";
import {AddIcon} from "@chakra-ui/icons";

const getData = async (collection: String) => {
    const res = await fetch(`http://localhost:3000/api/${collection}`, {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

const handleAdoptionRequest = async (id: String, decision: string) => {
    const res = await fetch(`http://localhost:3000/api/adoption/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(decision)
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
    const [posts, setPosts] = useState<PostType[]>([]);
    const [adoptionReqs, setAdoptionReqs] = useState<AdoptionType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const petsData = await getData("pets");
                setPets(petsData);
                const postData = await getData("blog");
                setPosts(postData)
                const adoptionData = await getData("adoption");
                setAdoptionReqs(adoptionData)
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
                            <TableCaption>
                                <Link href="/pets/create">
                                    <Button colorScheme='teal'>Додати</Button>
                                </Link>
                            </TableCaption>
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
                                                    <DeleteButton id={pet.id} collection={"pets"} />
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
                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>База блогу</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Фото</Th>
                                    <Th>Ім'я</Th>
                                    <Th>Опис</Th>
                                    <Th>Дії</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {posts.map((post) => {
                                    return (
                                        <Tr>
                                            <Td>
                                                <Image
                                                    borderRadius='full'
                                                    boxSize='40px'
                                                    src={`/uploads/${post.imageUrl}`}
                                                    alt={post.name}
                                                />
                                            </Td>
                                            <Td>{post.name}</Td>
                                            <Td>{post.description.substring(0, 20) + "..."}</Td>
                                            <Td>
                                                <ButtonGroup gap='4'>
                                                    <Link href={`/blog/update/${post.id}`}>
                                                        <Button colorScheme='orange'>Оновити</Button>
                                                    </Link>
                                                    <DeleteButton id={post.id} collection={"blog"} />
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
                            Заявки на адопцію
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>База заявок на адопцію</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Фото</Th>
                                    <Th>Ім'я</Th>
                                    <Th>Користувач</Th>
                                    <Th>Електронна пошта</Th>
                                    <Th>Дії</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {adoptionReqs.map((req) => {
                                    return (
                                        <Tr>
                                            <Td>
                                                <Image
                                                    borderRadius='full'
                                                    boxSize='40px'
                                                    src={`/uploads/${req.imageUrl}`}
                                                    alt={req.pet}
                                                />
                                            </Td>
                                            <Td>{req.pet}</Td>
                                            <Td>{req.user}</Td>
                                            <Td>{req.email}</Td>
                                            <Td>
                                                <ButtonGroup gap='4'>
                                                    <Button
                                                        colorScheme='teal'
                                                        onClick={() => handleAdoptionRequest(req.id, "approve")}>
                                                        Прийняти
                                                    </Button>
                                                    <Button
                                                        colorScheme='red'
                                                        onClick={() => handleAdoptionRequest(req.id, "deny")}>
                                                        Відхилити
                                                    </Button>
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
        </Accordion>
    );
}

export default Dashboard;