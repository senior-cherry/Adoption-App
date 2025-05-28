import { Button, Image } from "@chakra-ui/react";
import Link from "next/link";
import { PostType } from "@/types/types";

const getData = async (id: string) => {
    const res = await fetch(`${process.env.BASE_URL}/api/blog/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
};

type Props = {
    params: { id: string };
};

const SinglePost = async ({ params }: Props) => {
    const post: PostType = await getData(params.id);

    return (
        <div className="min-h-screen bg-white py-16 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Image
                        src={`/uploads/${post.imageUrl}`}
                        alt={post.imageUrl}
                        className="w-full h-[400px] object-cover rounded-2xl shadow-md"
                    />
                </div>
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
                    {post.name}
                </h1>
                <p className="text-center text-gray-500 text-lg mb-10">
                    {post.createdAt.toString().substring(0, 10)}
                </p>
                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-line">
                    {post.description}
                </div>
                <div className="mt-12 text-center">
                    <Link href="/blog">
                        <Button colorScheme="blue" size="lg">
                            Назад
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SinglePost;
