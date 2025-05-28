"use client";
import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useUser, useSession} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";

type Inputs = {
    name: string;
    engName: string;
    description: string;
    engDescription: string;
};

type Params = {
    id: string;
}

const UpdatePostPage = ({ params }: Params) => {
    const {session} = useSession();
    const {isLoaded}  = useUser();
    const userRole = checkUserRole(session);

    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        engName: "",
        description: "",
        engDescription: "",
        imageUrl: ""
    });
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [file, setFile] = useState<File>();

    const router = useRouter();

    useEffect(() => {
        const initialize = async () => {

            if (isLoaded) {
                if (userRole !== "org:admin") {
                    setIsAllowed(false);
                } else {
                    setIsAllowed(true);
                }
            }

            try {
                const res = await fetch(`/api/blog/${params.id}`);
                const data = await res.json();
                setInputs({
                    name: data.name,
                    engName: data.engName,
                    description: data.description,
                    engDescription: data.engDescription,
                    imageUrl: data.imageUrl,
                });
            } catch (error) {
                console.error("Error fetching post:", error);
                setError("Failed to load blog post data");
            }
        };

        initialize();
    }, [isLoaded, userRole, params.id]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);

        let uploadedImageName = inputs.imageUrl;

        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error(await res.text());
                }

                const result = await res.json();
                uploadedImageName = result.filename || file.name;
            } catch (err) {
                console.error("Upload error:", err);
                return;
            }
        }

        try {
            const res = await fetch(`/api/blog/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageUrl: uploadedImageName,
                    ...inputs,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            router.push(`/blog/post/${data.id}`);
        } catch (err) {
            console.error("Update error:", err);
            setError(err instanceof Error ? err.message : "Failed to update post");
        } finally {
            setIsLoading(false);
        }
    };

    if (isAllowed === false) {
        return <div className="p-4">You must have admin rights to view this page.</div>;
    }

    if (isAllowed === null) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="form">
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
                <div className="w-full flex flex-col gap-2 ">
                    <label
                        className="text-sm cursor-pointer flex gap-4 items-center"
                        htmlFor="file"
                    >
                        <Image src="/download.png" alt="" width={30} height={20} />
                        <span>Завантажити картинку</span>
                    </label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0])}
                        id="file"
                        className="hidden"
                    />
                    {inputs.imageUrl && (
                        <Image
                            src={`/uploads/${inputs.imageUrl}`}
                            alt="Current"
                            width={100}
                            height={100}
                            className="mt-2"
                        />
                    )}
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Назва</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Назва"
                        name="name"
                        value={inputs.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Назва англійською</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Назва англійською"
                        name="engName"
                        value={inputs.engName}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Опис</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Опис"
                        name="description"
                        value={inputs.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Опис англійською</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Опис англійською"
                        name="engDescription"
                        value={inputs.engDescription}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-orange-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center disabled:bg-orange-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Оновлення..." : "Підтвердити"}
                </button>
            </form>
        </div>
    );
};

export default UpdatePostPage;
