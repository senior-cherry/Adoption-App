"use client";

// import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as fs from "fs";

type Inputs = {
    name: string;
    species: string;
    age: string;
    catSlug: string;
};

type Skill = {
    title: string;
    additionalDesc: string;
};

const uploadDir = './public/uploads';

const AddPage = () => {
    // const { data: session, status } = useSession();
    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        species: "",
        age: "",
        catSlug: "",
    });

    const [skill, setSkill] = useState<Skill>({
        title: "",
        additionalDesc: "",
    });

    const [skills, setSkills] = useState<Skill[]>([]);
    const [file, setFile] = useState<File>();

    const router = useRouter();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    // if (status === "unauthenticated" || !session?.user.isAdmin) {
    //     router.push("/");
    // }

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

    const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const item = (target.files as FileList)[0];
        setFile(item);
    };

    // const getNewImageName = (name: string | undefined) => {
    //     let newName = uuid();
    //     return newName + name.substring(name.lastIndexOf('.'), name.length);
    // }

    const upload = async () => {
        // @ts-ignore
        const newImageName = file.name;
        // // @ts-ignore
        // const buffer = Buffer.from(await file.arrayBuffer());
        //
        // try {
        //     await fs.writeFile(`${uploadDir}/${file}`, buffer, (err) => {
        //         if (err) throw err;
        //         console.log('The file has been saved!');
        //     });
        // } catch(error) {
        //     console.log(error);
        // }

        return newImageName;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const url = await upload();
            const res = await fetch("http://localhost:3000/api/pets", {
                method: "POST",
                body: JSON.stringify({
                    img: url,
                    ...inputs,
                    skills,
                }),
            });

            const data = await res.json();

            router.push(`/pets/${data.id}`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
                <h1 className="text-4xl mb-2 text-gray-300 font-bold">
                    Add New Product
                </h1>
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
                        onChange={handleChangeImg}
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
                {/*<div className="w-full flex flex-col gap-2">*/}
                {/*    <label className="text-sm">Description</label>*/}
                {/*    <textarea*/}
                {/*        rows={3}*/}
                {/*        className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"*/}
                {/*        placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."*/}
                {/*        name="desc"*/}
                {/*        onChange={handleChange}*/}
                {/*    />*/}
                {/*</div>*/}
                {/*<div className="w-full flex flex-col gap-2 ">*/}
                {/*    <label className="text-sm">Price</label>*/}
                {/*    <input*/}
                {/*        className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"*/}
                {/*        type="number"*/}
                {/*        placeholder="29"*/}
                {/*        name="price"*/}
                {/*        onChange={handleChange}*/}
                {/*    />*/}
                {/*</div>*/}
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

export default AddPage;