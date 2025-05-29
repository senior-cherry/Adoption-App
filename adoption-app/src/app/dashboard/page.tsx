"use client";
import React, {useEffect, useState} from "react";
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
import Link from "next/link";
import {sendEmail} from "@/actions/sendEmailMessage";
import ConfirmModal from "@/components/ConfirmModal";
import {revalidatePath} from "next/cache";
import {Tooltip} from "@/components/Tooltip";
import {useLocale, useTranslations} from "next-intl";

const getData = async (collection: String) => {
    const res = await fetch(`/api/${collection}`, {
        cache: "no-store"
    })

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

    const message = await sendEmail(email, decision);

    if (message.success) {
        revalidatePath("/");
    }
}

const Dashboard = () => {
    const locale = useLocale();
    const t = useTranslations("dashboard");
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
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

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
            setIsAllowed(false);
        } else {
            setIsAllowed(true);
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

    if (isAllowed === false) {
        return <div className="p-4">{t("message.notAllowed")}</div>;
    }

    if (isAllowed === null) {
        return <div className="p-4">{t("message.loading")}...</div>;
    }

    return (
        <Accordion allowMultiple>
            <AccordionItem>
                <h2>
                    <AccordionButton onClick={() => fetchData("pets")}>
                        <Box as='span' flex='1' textAlign='left'>
                            {t("tables.pets")}
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>
                                <Link href="/pets/create">
                                    <Button colorScheme='teal'>{t("actions.add")}</Button>
                                </Link>
                            </TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>{t("fields.image")}</Th>
                                    <Th>{t("fields.name")}</Th>
                                    <Th>{t("fields.species")}</Th>
                                    <Th>{t("fields.age")}</Th>
                                    <Th>{t("fields.category")}</Th>
                                    <Th>{t("fields.actions")}</Th>
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
                                                        <Button colorScheme='orange'>{t("actions.update")}</Button>
                                                    </Link>
                                                    <ConfirmModal id={pet.id} collection={"pets"} isIcon={false} />
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
                            {t("tables.categories")}
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>
                                <Link href="/categories/create">
                                    <Button colorScheme='teal'>{t("actions.add")}</Button>
                                </Link>
                            </TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>{t("fields.title")}</Th>
                                    <Th>{t("fields.description")}</Th>
                                    <Th>{t("fields.actions")}</Th>
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
                                                        <Button colorScheme='orange'>{t("actions.update")}</Button>
                                                    </Link>
                                                    <ConfirmModal id={category.id} collection={"categories"} isIcon={false} />
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
                            {t("tables.articles")}
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>
                                <Link href="/blog/create">
                                    <Button colorScheme='teal'>{t("actions.add")}</Button>
                                </Link>
                            </TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>{t("fields.image")}</Th>
                                    <Th>{t("fields.title")}</Th>
                                    <Th>{t("fields.description")}</Th>
                                    <Th>{t("fields.actions")}</Th>
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
                                                        <Button colorScheme='orange'>{t("actions.update")}</Button>
                                                    </Link>
                                                    <ConfirmModal id={post.id} collection={"blog"} isIcon={false} />
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
                            {t("tables.adoption")}
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>{t("tables.adoptionCaption")}</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>{t("fields.image")}</Th>
                                    <Th>{t("fields.species")}</Th>
                                    <Th>{t("fields.user")}</Th>
                                    <Th>{t("fields.email")}</Th>
                                    <Th>{t("fields.aiConclusion")}</Th>
                                    <Th>{t("fields.actions")}</Th>
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
                                            <Td>
                                                <Tooltip content={req.aiConclusion as string} showArrow portalled={false}>
                                                    <Button variant="outline" colorScheme="orange">{t("fields.aiConclusion")}</Button>
                                                </Tooltip>
                                            </Td>
                                            <Td>
                                                <ButtonGroup gap='4'>
                                                    <Button
                                                        colorScheme='teal'
                                                        onClick={() => handleAdoptionRequest(req.id, "approve", req.email)}>
                                                        {t("actions.accept")}
                                                    </Button>
                                                    <Button
                                                        colorScheme='red'
                                                        onClick={() => handleAdoptionRequest(req.id, "deny", req.email)}>
                                                        {t("actions.deny")}
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
