"use client";

import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";
import Image from "next/image";
import {useUser, useSession} from "@clerk/nextjs";
import {checkUserRole} from "@/utils/userUtils";


type Inputs = {
    name: string;
    species: string;
    age: string;
    catSlug: string;
    isFeatured: boolean
};

type Skill = {
    title: string;
    additionalDesc: string;
};

const UpdatePage = ({ params }: Params) => {
    const {session} = useSession();
    const {user}  = useUser();
    const userRole = checkUserRole(session);

    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        species: "",
        age: "",
        catSlug: "",
        isFeatured: true
    });

    const [skill, setSkill] = useState<Skill>({
        title: "",
        additionalDesc: "",
    });

    const [skills, setSkills] = useState<Skill[]>([]);
    const [file, setFile] = useState<File>();

    const router = useRouter();

    useEffect(() => {
        if (!user || userRole !== "admin") {
            router.push("/");
        }
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSkill((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
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
            const res = await fetch(`http://localhost:3000/api/pets/${params.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    imageUrl: file?.name,
                    ...inputs,
                    skills,
                }),
            });

            const data = await res.json();
            console.log(data);

            router.push(`/pets/${data.id}`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
                <div className="w-full flex flex-col gap-2 ">
                    <label
                        className="text-sm cursor-pointer flex gap-4 items-center"
                        htmlFor="file"
                    >
                        <Image src="/upload.png" alt="" width={30} height={20} />
                        <span>Upload Image</span>
                    </label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0])}
                        id="file"
                        className="hidden"
                    />
                </div>
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
                    <label className="text-sm">Species</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Species"
                        name="species"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Age</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Age"
                        name="age"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 ">
                    <label className="text-sm">Category</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder="Dogs, Cats, etc."
                        name="catSlug"
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">Skills</label>
                    <div className="flex">
                        <input
                            className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                            type="text"
                            placeholder="Title"
                            name="title"
                            onChange={changeOption}
                        />
                        <input
                            className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                            type="text"
                            placeholder="Additional Description"
                            name="additionalDesc"
                            onChange={changeOption}
                        />
                        <button
                            className="bg-gray-500 p-2 text-white"
                            onClick={() => setSkills((prev) => [...prev, skill])}
                        >
                            Add Skill
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {skills.map((skill) => (
                            <div
                                key={skill.title}
                                className="p-2  rounded-md cursor-pointer bg-gray-200 text-gray-400"
                                onClick={() =>
                                    setSkills((prev) =>
                                        prev.filter((item) => item.title !== skill.title)
                                    )
                                }
                            >
                                <span>{skill.title}</span>
                                <span className="text-xs"> ({skill.additionalDesc})</span>
                            </div>
                        ))}
                    </div>
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

export default UpdatePage;