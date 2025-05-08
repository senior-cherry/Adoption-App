"use client";
import {useSession, useUser} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon, Box, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Image, ButtonGroup, Button
} from '@chakra-ui/react';
import {AdoptionType, CategoryType, PetType, PostType} from "@/types/types";
import {useEffect, useState} from "react";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import {redirect} from "next/navigation";
import {sendEmail} from "@/actions/sendEmailMessage";

const getData = async (collection: String) => {
    const res = await fetch(`/api/${collection}`, {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

const handleAdoptionRequest = async (id: String, decision: string, email: string) => {
    const res = await fetch(`/api/adoption/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(decision)
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    await sendEmail(email, decision);
}

const Dashboard = () => {
    const {session} = useSession();
    const {isLoaded}  = useUser();
    const userRole = checkUserRole(session);
    const [pets, setPets] = useState<PetType[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [adoptionReqs, setAdoptionReqs] = useState<AdoptionType[]>([]);
    const [loadedSections, setLoadedSections] = useState<{ [key: string]: boolean }>({
        pets: false,
        categories: false,
        blog: false,
        adoption: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const petsData = await getData("pets");
                setPets(petsData);
                const categoriesData = await getData("categories");
                setCategories(categoriesData);
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

    const fetchData = async (section: string) => {
        if (loadedSections[section]) return;

        try {
            let data;
            switch (section) {
                case "pets":
                    data = await getData("pets");
                    setPets(data);
                    break;
                case "categories":
                    data = await getData("categories");
                    setCategories(data);
                    break;
                case "blog":
                    data = await getData("blog");
                    setPosts(data);
                    break;
                case "adoption":
                    data = await getData("adoption");
                    setAdoptionReqs(data);
                    break;
            }
            setLoadedSections((prev) => ({ ...prev, [section]: true }));
        } catch (error) {
            console.error(`Error fetching ${section}:`, error);
        }
    };


    return (
        <Accordion>
            <AccordionItem>
                <h2>
                    <AccordionButton onClick={() => fetchData("pets")}>
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
                                        <Tr key={pet.id}>
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
                    <AccordionButton onClick={() => fetchData("categories")}>
                        <Box as='span' flex='1' textAlign='left'>
                            Категорії
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>
                                <Link href="/categories/create">
                                    <Button colorScheme='teal'>Додати</Button>
                                </Link>
                            </TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Назва</Th>
                                    <Th>Опис</Th>
                                    <Th>Дії</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {categories.map((category) => {
                                    return (
                                        <Tr key={category.id}>
                                            <Td>{category.name}</Td>
                                            <Td>{category.description}</Td>

                                            <Td>
                                                <ButtonGroup gap='4'>
                                                    <Link href={`/categories/update/${category.id}`}>
                                                        <Button colorScheme='orange'>Оновити</Button>
                                                    </Link>
                                                    <DeleteButton id={category.id} collection={"categories"} />
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
                    <AccordionButton onClick={() => fetchData("blog")}>
                        <Box as='span' flex='1' textAlign='left'>
                            Статті
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>
                                <Link href="/blog/create">
                                    <Button colorScheme='teal'>Додати</Button>
                                </Link>
                            </TableCaption>
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
                                        <Tr key={post.id}>
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
                    <AccordionButton onClick={() => fetchData("adoption")}>
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
                                    <Th>Вид</Th>
                                    <Th>Користувач</Th>
                                    <Th>Електронна пошта</Th>
                                    <Th>Номер телефону</Th>
                                    <Th>Адреса</Th>
                                    <Th>Висновок ШІ</Th>
                                    <Th>Дії</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {adoptionReqs.map((req) => {
                                    return (
                                        <Tr key={req.id}>
                                            <Td>
                                                <Image
                                                    borderRadius='full'
                                                    boxSize='40px'
                                                    src={`/uploads/${req.imageUrl}`}
                                                    alt={req.species}
                                                />
                                            </Td>
                                            <Td>{req.species}</Td>
                                            <Td>{req.user}</Td>
                                            <Td>{req.email}</Td>
                                            <Td>{req.phoneNumber}</Td>
                                            <Td>{req.address}</Td>
                                            <Td>{req.aiConclusion}</Td>
                                            <Td>
                                                <ButtonGroup gap='4'>
                                                    <Button
                                                        colorScheme='teal'
                                                        onClick={() => handleAdoptionRequest(req.id, "approve", req.email)}>
                                                        Прийняти
                                                    </Button>
                                                    <Button
                                                        colorScheme='red'
                                                        onClick={() => handleAdoptionRequest(req.id, "deny", req.email)}>
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


