"use client";
import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useUser, useSession} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";

type Inputs = {
    name: string;
    engName: string;
    species: string;
    engSpecies: string;
    age: string;
    engAge: string;
    gender: string;
    engGender: string;
    desc: string;
    engDesc: string;
    catSlug: string;
    isFeatured: boolean;
    imageUrl?: string;
};

const AddPage = () => {
    const {session} = useSession();
    const {isLoaded}  = useUser();
    const userRole = checkUserRole(session);

    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        engName: "",
        species: "",
        engSpecies: "",
        age: "",
        engAge: "",
        gender: "",
        engGender: "",
        desc: "",
        engDesc: "",
        catSlug: "",
        isFeatured: true
    });
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

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

        if (!file) return;

        let uploadedImageName = file.name;

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error(await res.text());

            const result = await res.json();
            uploadedImageName = result.filename || file.name;
        } catch (err) {
            console.error(err)
        }

        try {
            const res = await fetch(`/api/pets`, {
                method: "POST",
                body: JSON.stringify({
                    ...inputs,
                    imageUrl: uploadedImageName
                }),
            });

            const data = await res.json();
            router.push(`/pets/pet/${data.id}`);
        } catch (err) {
            console.error(err);
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
                    <label className="text-sm">Ім'я</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Ім'я"
                        name="name"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Ім'я ангійською</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Ім'я англійською"
                        name="engName"
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
                    <label className="text-sm">Вид англійською</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Вид англійською"
                        name="engSpecies"
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
                    <label className="text-sm">Вік англійською</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Вік англійською"
                        name="engAge"
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
                    <label className="text-sm">Стать англійською</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Стать англійською"
                        name="engGender"
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
                    <label className="text-sm">Опис англійською</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Опис англійською"
                        name="engDesc"
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

export default AddPage;