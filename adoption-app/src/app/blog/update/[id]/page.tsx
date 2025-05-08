"use client";
import Image from "next/image";
import {redirect, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useUser, useSession} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";

type Inputs = {
    name: string;
    description: string;
};

const UpdatePostPage = ({ params }: Params) => {
    const {session} = useSession();
    const {isLoaded}  = useUser();
    const userRole = checkUserRole(session);

    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        description: "",
        imageUrl: ""
    });

    const [file, setFile] = useState<File>();

    const router = useRouter();

    useEffect(() => {
        const initialize = async () => {
            if (!isLoaded) return;

            if (userRole !== "org:admin") {
                redirect("/");
                return;
            }

            try {
                const res = await fetch(`/api/blog/${params.id}`);
                const data = await res.json();
                setInputs({
                    name: data.name,
                    description: data.description,
                    imageUrl: data.imageUrl,
                });
            } catch (error) {
                console.error("Error fetching post:", error);
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
        console.log(e.target.name + " " + e.target.value)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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

            const data = await res.json();

            router.push(`/blog/post/${data.id}`);
        } catch (err) {
            console.error("Update error:", err);
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

export default UpdatePostPage;