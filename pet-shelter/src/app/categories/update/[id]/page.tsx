"use client";
import {redirect, useRouter} from "next/navigation";
import React, {useState} from "react";
import {useSession, useUser} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";

type Inputs = {
    name: string;
    description: string;
    slug: string;
};

const UpdateCategoryPage = ({params}: Params) => {
    const {session} = useSession();
    const {isLoaded, user}  = useUser();
    const userRole = checkUserRole(session);

    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        description: "",
        slug: ""
    });

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

        try {
            const res = await fetch(`http://localhost:3000/api/categories/${params.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    ...inputs,
                }),
            });

            const data = await res.json();
            console.log(data);

            router.push(`/pets/${data.slug}`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form">
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Name</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Name"
                        name="name"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Description</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Description"
                        name="description"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Slug</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Slug"
                        name="slug"
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-orange-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default UpdateCategoryPage;