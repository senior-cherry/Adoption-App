import {Image} from "@chakra-ui/react";
import Link from "next/link";
import {PostType} from "@/types/types";
import {getBaseUrl} from "@/utils/getBaseUrl";
import {getLocale} from "next-intl/server";

const getData = async () => {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/blog`, {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

const Blog = async () => {
    const locale = await getLocale();
    const posts: PostType[] = await getData();

    return (
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

    );
}

export default Blog;