"use client";
import React, { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { checkUserRole } from "@/utils/userUtils";
import {
    Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
    Box, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td,
    Image, ButtonGroup, Button, useToast
} from '@chakra-ui/react';
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";
import { Tooltip } from "@/components/Tooltip";
import { useLocale, useTranslations } from "next-intl";
import {useRouter} from "next/navigation";
import { AdoptionType, CategoryType, PetType, PostType } from "@/types/types";

const getData = async (collection: string) => {
    try {
        const res = await fetch(`/api/${collection}?admin=${(collection === "pets")}`, { cache: "no-store" });
        const data = await res.json();

        if (collection === "pets" && "pets" in data) {
            return data.pets;
        }

        if (collection === "blog" && "posts" in data) {
            return data.posts;
        }

        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error(`Fetch error for /api/${collection}:`, e);
        return [];
    }
};

const Dashboard = () => {
    const locale = useLocale();
    const t = useTranslations("dashboard");
    const tt = useTranslations("adoption-toast");
    const router = useRouter();
    const toast = useToast();
    const { session } = useSession();
    const { isLoaded } = useUser();
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
        if (!isLoaded) return;
        setIsAllowed(userRole === "org:admin");
    }, [isLoaded, userRole]);

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

    const handleAdoptionRequest = async (id: String, decision: string, email: string) => {
        try {
            const res = await fetch(`/api/adoption/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ decision, email }),
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error("Failed");
            }

            router.refresh();

            toast({
                title: decision === 'approve' ? tt("approve") : tt("deny"),
                status: decision === 'approve' ? 'success' : 'warning',
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: tt("errorTitle"),
                description: tt("errorDescription"),
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }

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
                        <Box as='span' flex='1' textAlign='left'>{t("tables.pets")}</Box>
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
                                {pets.map((pet) => (
                                    <Tr key={pet.id}>
                                        <Td>
                                            <Image borderRadius='full' boxSize='40px'
                                                   src={pet.imageUrl}
                                                   alt={locale === 'uk' ? pet.name : pet.engName}
                                            />
                                        </Td>
                                        <Td>{locale === 'uk' ? pet.name : pet.engName}</Td>
                                        <Td>{locale === 'uk' ? pet.species : pet.engSpecies}</Td>
                                        <Td>{locale === 'uk' ? pet.age : pet.engAge}</Td>
                                        <Td>{pet.catSlug}</Td>
                                        <Td>
                                            <ButtonGroup gap='4'>
                                                <Link href={`/pets/update/${pet.id}`}>
                                                    <Button colorScheme='orange'>{t("actions.update")}</Button>
                                                </Link>
                                                <ConfirmModal
                                                    id={pet.id}
                                                    collection={"pets"}
                                                    isIcon={false}
                                                    onDeleteSuccess={() => setPets(prev => prev.filter(p => p.id !== pet.id))}
                                                />
                                            </ButtonGroup>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
                <h2>
                    <AccordionButton onClick={() => fetchData("categories")}>
                        <Box as='span' flex='1' textAlign='left'>{t("tables.categories")}</Box>
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
                                {categories.map((category) => (
                                    <Tr key={category.id}>
                                        <Td>{locale === 'uk' ? category.name : category.engName}</Td>
                                        <Td>{locale === 'uk' ? category.description : category.engDescription}</Td>
                                        <Td>
                                            <ButtonGroup gap='4'>
                                                <Link href={`/categories/update/${category.id}`}>
                                                    <Button colorScheme='orange'>{t("actions.update")}</Button>
                                                </Link>
                                                <ConfirmModal
                                                    id={category.id}
                                                    collection={"categories"}
                                                    isIcon={false}
                                                    onDeleteSuccess={() => setCategories(prev => prev.filter(c => c.id !== category.id))}
                                                />
                                            </ButtonGroup>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
                <h2>
                    <AccordionButton onClick={() => fetchData("blog")}>
                        <Box as='span' flex='1' textAlign='left'>{t("tables.articles")}</Box>
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
                                {posts.map((post) => (
                                    <Tr key={post.id}>
                                        <Td>
                                            <Image borderRadius='full' boxSize='40px'
                                                   src={post.imageUrl}
                                                   alt={locale === 'uk' ? post.name : post.engName} />
                                        </Td>
                                        <Td>{locale === 'uk' ? post.name : post.engName}</Td>
                                        <Td>{(locale === 'uk' ? post.description.substring(0, 20) : post.engDescription.substring(0, 20)) + "..."}</Td>
                                        <Td>
                                            <ButtonGroup gap='4'>
                                                <Link href={`/blog/update/${post.id}`}>
                                                    <Button colorScheme='orange'>{t("actions.update")}</Button>
                                                </Link>
                                                <ConfirmModal
                                                    id={post.id}
                                                    collection={"blog"}
                                                    isIcon={false}
                                                    onDeleteSuccess={() => setPosts(prev => prev.filter(p => p.id !== post.id))}
                                                />
                                            </ButtonGroup>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
                <h2>
                    <AccordionButton onClick={() => fetchData("adoption")}>
                        <Box as='span' flex='1' textAlign='left'>{t("tables.adoption")}</Box>
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
                                {adoptionReqs.map((req) => (
                                    <Tr key={req.id}>
                                        <Td>
                                            <Image borderRadius='full' boxSize='40px' src={req.imageUrl} alt={req.species} />
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
                                                <Button colorScheme='teal' onClick={() => handleAdoptionRequest(req.id, "approve", req.email)}>
                                                    {t("actions.accept")}
                                                </Button>
                                                <Button colorScheme='red' onClick={() => handleAdoptionRequest(req.id, "deny", req.email)}>
                                                    {t("actions.deny")}
                                                </Button>
                                            </ButtonGroup>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};

export default Dashboard;
