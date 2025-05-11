import { Button, ButtonGroup, Image } from "@chakra-ui/react";
import AdoptButtonGroup from "@/components/AdoptButtonGroup";
import Link from "next/link";
import { PetType } from "@/types/types";

type Props = {
    params: { id: string };
};

const getData = async (id: string) => {
    const res = await fetch(`${process.env.BASE_URL}/api/pets/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
};

const SinglePet = async ({ params }: Props) => {
    const pet: PetType = await getData(params.id);

    const getGenderColor = () => {
        if (pet.gender === "Самець" || pet.gender === "Хлопчик") return "text-blue-600";
        if (pet.gender === "Самка" || pet.gender === "Дівчинка") return "text-pink-500";
        return "text-red-600";
    };

    return (
        <div className="min-h-screen bg-white py-10 px-4 md:px-10">
            <div className="max-w-5xl mx-auto bg-gray-50 rounded-2xl shadow-lg p-6 md:p-10">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2">
                        <div className="overflow-hidden rounded-xl border border-gray-200">
                            <Image
                                src={`/uploads/${pet.imageUrl}`}
                                alt={pet.imageUrl}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-3">
                        <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
                        <p className="text-lg text-gray-700">Вид: {pet.species}</p>
                        <p className="text-lg text-gray-700">Вік: {pet.age}</p>
                        <p className={`text-lg font-medium ${getGenderColor()}`}>
                            Стать: {pet.gender}
                        </p>
                        <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">{pet.desc}</p>

                        <div className="mt-6">
                            <ButtonGroup spacing="3">
                                <AdoptButtonGroup
                                    pet_id={pet.id}
                                    imageUrl={pet.imageUrl}
                                    species={pet.species}
                                />
                                <Link href="/pets">
                                    <Button variant="ghost" colorScheme="blue">
                                        Назад
                                    </Button>
                                </Link>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SinglePet;
