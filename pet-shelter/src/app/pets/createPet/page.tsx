'use client';

import {useRef, useState} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function CreatePet() {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [age, setAge] = useState('');

    const router = useRouter();

    const handleNameChange = (event: any) => {
        setName(event.target.value);
    }

    const handleSpeciesChange = (event: any) => {
        setSpecies(event.target.value);
    }

    const handleAgeChange = (event: any) => {

        setAge(event.target.value);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();

        try {
            fetch('/api/add-pet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, species, age})})
            router.refresh();
        } catch (error) {
            console.error(error)
        }

        setName('');
        setSpecies('');
        setAge('');
    }

    const hiddenFileInput = useRef(null);

    const handleImgChange = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];
            console.log(i)
            const body = new FormData();
            body.append("image", i)
        }
    }

    const handleClick = (event: any) => {
        // @ts-ignore
        hiddenFileInput.current.click();
    }

    return (
        <div className="add-form">
            <h1>Add Pet</h1>
            <Link href="/">Pets</Link>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name: </label><br></br>
                    <input type="text" id="name" value={name} onChange={handleNameChange} required />
                </div>
                <div>
                    <label htmlFor="species">Species: </label><br></br>
                    <input type="text" id="species" value={species} onChange={handleSpeciesChange} required />
                </div>
                <div>
                    <label htmlFor="age">Age: </label><br></br>
                    <input type="text" id="age" value={age} onChange={handleAgeChange} required />
                </div>
                <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={handleImgChange}
                    accept="image/*"
                />
                <button onClick={handleClick}>Click</button>
                <button type="submit">Submit</button>
            </form>
            <Image src={} alt={}
        </div>
    );
}