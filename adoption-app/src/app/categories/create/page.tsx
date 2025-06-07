"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useSession, useUser} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";
import {useTranslations} from "next-intl";

type Inputs = {
    name: string;
    engName: string;
    description: string;
    engDescription: string;
    slug: string;
};

const AddCategoryPage = () => {
    const t = useTranslations("admin-forms");
    const {session} = useSession();
    const {isLoaded}  = useUser();
    const userRole = checkUserRole(session);

    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        engName: "",
        description: "",
        engDescription: "",
        slug: ""
    });
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/categories`, {
                method: "POST",
                body: JSON.stringify({
                    ...inputs,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
            }

            router.push(`/dashboard`);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to create category");
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
                    <label className="text-sm">{t("ukTitle")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={t("ukTitle")}
                        name="name"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">{t("enTitle")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={t("enTitle")}
                        name="engName"
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
                        name="description"
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
                        name="engDescription"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">{t("category")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={t("category")}
                        name="slug"
                        onChange={handleChange}
                        required
                    />
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

export default AddCategoryPage;