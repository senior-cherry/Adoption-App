"use client";
import {useEffect, useState} from "react";
import {Button, Center, Flex, Image, Text} from "@chakra-ui/react";
import Link from "next/link";
import {useLocale} from "next-intl";
import {useRouter, useSearchParams} from "next/navigation";
import Loading from "@/components/Loading";
import {PostType} from "@/types/types";

const Blog = () => {
    const locale = useLocale();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const postsPerPage = 3;

    const pageParam = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        if (!searchParams.get("page")) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", "1");
            router.replace(`?${params.toString()}`);
        }

        const fetchPosts = async () => {
            setIsLoading(true);
            setCurrentPage(pageParam);

            try {
                const params = new URLSearchParams();
                params.set("page", pageParam.toString());
                params.set("limit", postsPerPage.toString());

                const res = await fetch(`/api/blog?${params.toString()}`, {
                    cache: "no-store"
                });
                const data = await res.json();

                setPosts(data.posts || []);
                setTotalPosts(data.totalCount || 0);
            } catch (error) {
                console.error("Error fetching pets:", error);
                setPosts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [pageParam, locale]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    if (isLoading) {
        return (
            <Flex direction="column" align="center" gap={4} mt={12}>
                <Loading />
                <Text color="gray.600">{locale === 'uk' ? "Завантаження" : "Loading"}...</Text>
            </Flex>
        );
    }

    return (
        <div>
            {posts.length > 0 ? (
                <>
                    <div className="my-16 max-w-4xl mx-auto px-4 md:px-0 space-y-8">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
                            >
                                <div className="w-full md:w-48 h-48 overflow-hidden rounded-lg">
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.imageUrl}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">
                                        {post.createdAt.toString().substring(0, 10)}
                                    </p>
                                    <Link href={`/blog/post/${post.id}`}>
                                        <h2 className="text-xl font-semibold text-gray-900 hover:underline">
                                            {locale === 'uk' ? post.name : post.engName}
                                        </h2>
                                    </Link>
                                    <p className="mt-2 text-gray-700">
                                        {locale === 'uk' ? post.description.substring(0, 100) : post.engDescription.substring(0, 100)}...
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <Flex mt={10} mb={10} gap={2} wrap="wrap" justify="center">
                            {[...Array(totalPages)].map((_, i) => (
                                <Button key={i} onClick={() => handlePageChange(i + 1)} colorScheme={currentPage === (i + 1) ? "orange" : "gray"}>
                                    {i + 1}
                                </Button>
                            ))}
                        </Flex>
                    )}
                </>
            ) : (
                <Center h="200px" w="full" maxW="4xl" flexDirection="column">
                    <Text fontSize="lg" color="gray.600" mb={2}>
                        {locale === 'uk' ? "Не знайдено постів блогу" : "No posts found"}
                    </Text>
                </Center>
            )}
        </div>
    );
}

export default Blog;