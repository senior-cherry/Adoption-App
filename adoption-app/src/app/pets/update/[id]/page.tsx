"use client";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";
import Image from "next/image";
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
    isFeatured: boolean
};

const UpdatePage = ({ params }: Params) => {
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
        isFeatured: true,
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
                const res = await fetch(`/api/pets/${params.id}`);
                const data = await res.json();
                setInputs({
                    name: data.name,
                    engName: data.engName,
                    species: data.species,
                    engSpecies: data.engSpecies,
                    age: data.age,
                    engAge: data.engAge,
                    gender: data.gender,
                    engGender: data.engGender,
                    desc: data.desc,
                    engDesc: data.engDesc,
                    catSlug: data.catSlug,
                    imageUrl: data.imageUrl,
                    isFeatured: true
                });
            } catch (error) {
                console.error("Error fetching pet:", error);
                setError("Failed to load pet data");
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
            const res = await fetch(`/api/pets/${params.id}`, {
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
            router.push(`/pets/pet/${data.id}`);
        } catch (err) {
            console.error("Update error:", err);
            setError(err instanceof Error ? err.message : "Failed to update pet");
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
                    <label className="text-sm">Ім'я</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Ім'я"
                        name="name"
                        value={inputs.name}
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
                        value={inputs.engName}
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
                        value={inputs.species}
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
                        value={inputs.engSpecies}
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
                        value={inputs.age}
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
                        value={inputs.engAge}
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
                        value={inputs.gender}
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
                        value={inputs.engGender}
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
                        value={inputs.desc}
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
                        value={inputs.engDesc}
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
                        value={inputs.catSlug}
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

export default UpdatePage;

