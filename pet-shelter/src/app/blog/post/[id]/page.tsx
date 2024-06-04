import {PostType} from "@/types/types";
import {Button, ButtonGroup, Image} from "@chakra-ui/react";
import AdoptButtonGroup from "@/app/components/AdoptButtonGroup";
import Link from "next/link";

const getData = async (id: string) => {
    const res = await fetch(`${process.env.PRODUCTION_URL}/api/blog/${id}`, {
        cache: "no-store"
    })

    return res.json();
}

type Props = {
    params: {id: string}
}

const SinglePost = async ({params}: Props) => {
    const post: PostType = await getData(params.id);

    return (
        <div className="main-wrapper">
            <div className="container">
                <div className="post-container">
                    <div className="post-container-left">
                        <div className="img-container">
                            <Image src={`/uploads/${post.imageUrl}`} alt={post.imageUrl} />
                        </div>
                    </div>
                    <div className="post-container-right">
                        <span className="post-title">{post.name}</span>
                        <span>{post.createdAt.toString().substring(0, 10)}</span>
                        <p className="post-description">
                            {post.description}
                        </p>
                        <div className="mt-5">
                            <Link href="/blog">
                                <Button colorScheme='blue'>
                                    Назад
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SinglePost;