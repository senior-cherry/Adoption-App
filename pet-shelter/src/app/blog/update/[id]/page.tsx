"use client";
import Image from "next/image";
import {redirect, useRouter} from "next/navigation";
import React, {useState} from "react";
import {useUser, useSession} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";

type Inputs = {
    name: string;
    description: string;
};

type Params = {
    params: {id: string}
}

const UpdatePostPage = ({ params }: Params) => {
    const {session} = useSession();
    const {isLoaded, user}  = useUser();
    const userRole = checkUserRole(session);

    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        description: "",
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
        console.log(e.target.name + " " + e.target.value)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) return

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            if (!res.ok) throw new Error(await res.text())
        } catch (err) {
            console.log(err)
        }

        try {
            const res = await fetch(`/api/blog/${params.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    imageUrl: file?.name,
                    ...inputs
                }),
            });

            const data = await res.json();
            console.log(data);

            router.push(`/blog/post/${data.id}`);
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
                    <label className="text-sm">Назва</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Назва"
                        name="name"
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