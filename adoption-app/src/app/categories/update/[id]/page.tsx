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

type Params = {
    params: {
        id: string
    };
}

const UpdateCategoryPage = ({params}: Params) => {
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
        const initialize = async () => {
            if (isLoaded) {
                if (userRole !== "org:admin") {
                    setIsAllowed(false);
                    return;
                } else {
                    setIsAllowed(true);
                }
            }

            try {
                const res = await fetch(`/api/categories/${params.id}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch category: ${res.status}`);
                }
                const data = await res.json();
                setInputs({
                    name: data.name || "",
                    engName: data.engName || "",
                    description: data.description || "",
                    engDescription: data.engDescription || "",
                    slug: data.slug || "",
                });
            } catch (error) {
                console.error("Error fetching category:", error);
                setError(t("categoryLoadingError"));
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

        try {
            const response = await fetch(`/api/categories/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...inputs,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            router.push(`/dashboard`);
        } catch (err) {
            console.error("Update error:", err);
            setError(err instanceof Error ? err.message : "Failed to update category");
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
                        value={inputs.name}
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
                        value={inputs.engName}
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
                        value={inputs.description}
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
                        value={inputs.engDescription}
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
                        value={inputs.slug}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-orange-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center disabled:bg-orange-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? t("updating") : t("submit")}
                </button>
            </form>
        </div>
    );
};

export default UpdateCategoryPage;