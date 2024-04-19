import Pet from "@/app/components/Pet";
import {PetType} from "@/types/types";

const getData = async (category: string) => {
    const res = await fetch(`http://localhost:3000/api/pets/category=${category}`, {
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
    const pets: PetType = await getData(params.category);
    return (
        <div>
            {pets.map((pet) => {
                return (
                    <Pet id={pet.id}
                         name={pet.name}
                         species={pet.species}
                         age={pet.age}
                         skills={pet.skills}
                         categoryName={pet.category.name}
                         key={pet.id}
                    />
                );
            })}
        </div>
    );
};

export default PetsByCategory;