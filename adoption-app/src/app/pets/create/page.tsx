"use client";
import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useUser, useSession} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";
import {CategoryType} from "@/types/types";
import {useLocale, useTranslations} from "next-intl";

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
    const locale = useLocale();
    const t = useTranslations("admin-forms");
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
                if (!res.ok) throw new Error(t("categoryLoadingError"));
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error(err);
                setError(t("categoryLoadingError"));
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

        let imageUrl = "";

        try {
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!res.ok) throw new Error(await res.text());

                const result = await res.json();
                imageUrl = result.data.secure_url;
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload image");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/pets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...inputs,
                    imageUrl: imageUrl || null
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
        return <div className="p-4">{t("notAdminMessage")}</div>;
    }

    if (isAllowed === null) {
        return <div className="p-4">{t("loadingMessage")}...</div>;
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
                            <span>{t("downloadImage")}</span>
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
                    <label className="text-sm">{t("ukName")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={t("ukName")}
                        name="name"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">{t("enName")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={t("enName")}
                        name="engName"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">{t("ukSpecies")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={t("ukSpecies")}
                        name="species"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">{t("enSpecies")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={t("enSpecies")}
                        name="engSpecies"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">{t("ukAge")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={t("ukAge")}
                        name="age"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">{t("enAge")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={t("enAge")}
                        name="engAge"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">{t("ukGender")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={t("ukGender")}
                        name="gender"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">{t("enGender")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={t("enGender")}
                        name="engGender"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">{t("ukDesc")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={t("ukDesc")}
                        name="desc"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">{t("enDesc")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={t("enDesc")}
                        name="engDesc"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{t("categoryName")}</label>
                    <select
                        name="catSlug"
                        value={inputs.catSlug}
                        onChange={handleChange}
                        required
                        className="ring-1 ring-orange-700 p-4 rounded-sm text-orange-700 outline-none"
                    >
                        <option value="" disabled>{t("chooseCategory")}</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.slug}>
                                {locale === 'uk' ? cat.name : cat.engName}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-orange-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center disabled:bg-orange-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? t("creating") : t("submit")}
                </button>
            </form>
        </div>
    );
};

export default AddPage;