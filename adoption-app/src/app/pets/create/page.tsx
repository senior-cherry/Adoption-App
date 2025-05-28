"use client";
import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useUser, useSession} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";
import {CategoryType} from "@/types/types";

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

    const [categories, setCategories] = useState<CategoryType[]>([]);
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [file, setFile] = useState<File>();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            if (!isLoaded) return;

            if (userRole !== "org:admin") {
                setIsAllowed(false);
                return;
            }

            setIsAllowed(true);

            try {
                const res = await fetch("/api/categories");
                if (!res.ok) throw new Error("Не вдалося завантажити категорії");
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error(err);
                setError("Не вдалося завантажити категорії");
            }
        };

        init();
    }, [isLoaded, userRole]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            router.push(`/pets/pet/${data.id}`);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to create pet");
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
                        required
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
                        required
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
                        required
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
                        required
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
                        required
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
                        required
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
                        required
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
                        required
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
                        required
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
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">Категорія</label>
                    <select
                        name="catSlug"
                        value={inputs.catSlug}
                        onChange={handleChange}
                        required
                        className="ring-1 ring-orange-700 p-4 rounded-sm text-orange-700 outline-none"
                    >
                        <option value="" disabled>Оберіть категорію</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.slug}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
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

export default AddPage;