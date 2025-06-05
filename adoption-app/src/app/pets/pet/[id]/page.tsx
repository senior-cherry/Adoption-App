import { ButtonGroup, Image } from "@chakra-ui/react";
import AdoptButtonGroup from "@/components/AdoptButtonGroup";
import { PetType } from "@/types/types";
import BackButton from "@/components/BackButton";
import {getLocale, getTranslations} from "next-intl/server";
import {getBaseUrl} from "@/utils/getBaseUrl";

type Props = {
    params: { id: string };
};

const getData = async (id: string) => {
    const baseUrl = await getBaseUrl();

    const res = await fetch(`${baseUrl}/api/pets/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
};

const SinglePet = async ({ params }: Props) => {
    const locale = await getLocale();
    const t = await getTranslations("single-pet");
    const pet: PetType = await getData(params.id);

    return (
        <div className="min-h-screen bg-white py-10 px-4 md:px-10">
            <div className="max-w-5xl mx-auto bg-gray-50 rounded-2xl shadow-lg p-6 md:p-10">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2">
                        <div className="overflow-hidden rounded-xl border border-gray-200">
                            <Image
                                src={pet.imageUrl}
                                alt={pet.imageUrl}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-3">
                        <h1 className="text-3xl font-bold text-gray-800">{locale === 'uk' ? pet.name : pet.engName}</h1>
                        <p className="text-lg text-gray-700">{t("species")}: {locale === 'uk' ? pet.species : pet.engSpecies}</p>
                        <p className="text-lg text-gray-700">{t("age")}: {locale === 'uk' ? pet.age : pet.engAge}</p>
                        <p className={"text-lg font-medium text-gray-700"}>
                            {t("gender")}: {locale === 'uk' ? pet.gender : pet.engGender}
                        </p>
                        <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">{locale === 'uk' ? pet.desc : pet.engDesc}</p>

                        <div className="mt-6">
                            <ButtonGroup spacing="3">
                                <AdoptButtonGroup
                                    pet_id={pet.id}
                                    imageUrl={pet.imageUrl}
                                    species={locale === 'uk' ? pet.species : pet.engSpecies}
                                />
                                    <BackButton>
                                        {locale === 'uk' ? "Назад" : "Back"}
                                    </BackButton>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SinglePet;
