<<<<<<< HEAD:pet-shelter/src/app/pets/update/[id]/page.tsx
"use client";

import {redirect, useRouter} from "next/navigation";
import React, {useState} from "react";
import Image from "next/image";
import {useUser, useSession} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";


type Inputs = {
    name: string;
    species: string;
    age: string;
    gender: string;
    desc: string;
    catSlug: string;
    isFeatured: boolean
};

type Params = {
    params: {id: string}
}

const UpdatePage = ({ params }: Params) => {
    const {session} = useSession();
    const {isLoaded, user}  = useUser();
    const userRole = checkUserRole(session);

    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        species: "",
        age: "",
        gender: "",
        desc: "",
        catSlug: "",
        isFeatured: true
    });

    const [file, setFile] = useState<File>();

    const router = useRouter();

    if (isLoaded) {
        if (userRole !== "org:admin") {
            redirect("/")
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) return

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`/api/upload`, {
                method: 'POST',
                body: formData
            })

        } catch (err) {
            console.log(err)
        }

        try {
            const res = await fetch(`/api/pets/${params.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    imageUrl: file?.name,
                    ...inputs,
                }),
            });

            const data = await res.json();
            console.log(data);

            router.push(`/pets/pet/${data.id}`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form">
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
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Ім&apos;я</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Ім'я"
                        name="name"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Вид</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Вид"
                        name="species"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Вік</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Вік"
                        name="age"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Стать</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Стать"
                        name="gender"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Опис</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Опис"
                        name="desc"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Категорія</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Собаки, Коти, Рептилії..."
                        name="catSlug"
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-orange-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center"
                >
                    Підтвердити
                </button>
            </form>
        </div>
    );
};

export default UpdatePage;
=======
"use client";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useUser, useSession} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";

type Inputs = {
    name: string;
    engName: string;
    description: string;
    engDescription: string;
    imageUrl?: string;
};

const AddPostPage = () => {
    const {session} = useSession();
    const {isLoaded}  = useUser();
    const userRole = checkUserRole(session);

    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        engName: "",
        description: "",
        engDescription: ""
    });
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [file, setFile] = useState<File>();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        if (isLoaded) {
            if (userRole !== "org:admin") {
                setIsAllowed(false);
            } else {
                setIsAllowed(true);
            }
        }
    }, [isLoaded, userRole]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
        if (error) setError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);

        if (!file) return;

        let uploadedImageName = file.name;

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error(await res.text())

            const result = await res.json();
            uploadedImageName = result.filename || file.name;
        } catch (err) {
            console.error(err)
        }

        try {
            const res = await fetch(`/api/blog`, {
                method: "POST",
                body: JSON.stringify({
                    ...inputs,
                    imageUrl: uploadedImageName
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            router.push(`/blog/post/${data.id}`);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to create post");
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
                <div className="w-full flex flex-col gap-2">
                    <label
                        className="text-sm cursor-pointer flex gap-4 items-center"
                        htmlFor="file"
                    >
                        <Image src="/download.png" alt="" width={30} height={20} />
                        <span>Завантажити картинку</span>
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        id="file"
                        className="hidden"
                    />
                    {previewUrl && (
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            width={100}
                            height={100}
                            className="mt-2 rounded"
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
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Назва англійською</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Назва англійською"
                        name="engName"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Опис</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Опис"
                        name="description"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Опис англійською</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Опис англійською"
                        name="engDescription"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-orange-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center disabled:bg-orange-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Створення..." : "Підтвердити"}
                </button>
            </form>
        </div>
    );
};

export default AddPostPage;
>>>>>>> dev:adoption-app/src/app/blog/create/page.tsx
