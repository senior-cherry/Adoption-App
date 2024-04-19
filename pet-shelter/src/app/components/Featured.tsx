import Image from "next/image";
import {PetType} from "@/types/types";

const getData = async () => {
    const res = await fetch("http://localhost:3000/api/pets", {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

const Featured = async () => {
    const featuredPets: PetType = await getData();
    return (
        <main className="pet">
            <div>
                {featuredPets.map((pet) => {
                    return (
                        <div>
                            <h3>Name: {pet.name}</h3>
                            <h4>Species: {pet.species}</h4>
                            <h4>Age: {pet.age}</h4>
                            <p>Category: {pet.category.name}</p>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}