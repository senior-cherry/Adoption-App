import {PetType} from "@/types/types";

const getData = async (category: string) => {
    const res = await fetch(`http://localhost:3000/api/pets?cat=${category}`, {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
}

type Props = {
    params: {category: string}
}

const PetsByCategory = async ({params}: Props) => {
    const pets: PetType[] = await getData(params.category);
    return (
        <div>
            {pets.map((pet) => {
                return (
                    <div>
                        <h2>{pet.name}</h2>
                    </div>
                );
            })}
        </div>
    );
};

export default PetsByCategory;