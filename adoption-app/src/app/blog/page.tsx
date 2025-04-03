import {PostType} from "@/types/types";
import {Image} from "@chakra-ui/react";
import Link from "next/link";

const getData = async () => {
    const res = await fetch(`${process.env.BASE_URL}/api/blog`, {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

const Blog = async () => {
    const posts: PostType = await getData();

    return (
        <main className="mt-12">
            <div className="blog">
                {posts.map((post) => {
                    return (
                        <div className="blog-post">
                            <div className="blog-post-img">
                                <Image src={`/uploads/${post.imageUrl}`} alt={post.imageUrl} />
                            </div>
                            <div className="blog-post-info">
                                <div className="blog-post-date">
                                    <span>{post.createdAt.toString().substring(0, 10)}</span>
                                </div>
                                <Link href={`/blog/post/${post.id}`}>
                                    <h1 className="blog-post-title">
                                        {post.name}
                                    </h1>
                                </Link>
                            <p className="blog-post-text">
                                {post.description.substring(0, 50) + "..."}
                            </p>
                        </div>
                </div>
                    );
                })}
            </div>
        </main>
    );
}

export default Blog;