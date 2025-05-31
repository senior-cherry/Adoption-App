"use client";
import {useSearchParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useUser} from "@clerk/nextjs";
import {useTranslations} from "next-intl";
import {useToast} from "@chakra-ui/react";

type Inputs = {
    user: string;
    user_id: string;
    age: number;
    phoneNumber: string;
    email: string;
    address: string;
    aptType: string;
    petsAllowed: string;
    kids: string;
    otherAnimals: string;
    liveWith: string;
    employmentStatus: string;
    incomeLevel: string;
    animalsBefore: string;
    nutritionalNeeds: string;
    reasonToAdoptPet: string;
    characterPreferences: string;
    lifeChangingActions: string;
    psychologicalDiseases: string;
    tendencyToBeImpulsive: string;
    emotionalStability: string;
    reactionToStress: string;
    uncontrolledAnger: string;
    blamesForAnger: string;
    attitudeToSpending: string;
    attitudeToBadBehaviour: string;
    requireLove: string;
    isAbleToFollowSchedule: string;
    friendlySupport: string;
    allergyToFur: string;
    howToRaisePet: string;
    reactionToBadAction: string;
    isPunishmentNecessary: string;
};

const AdoptionForm = () => {
    const toast = useToast()
    const q = useTranslations("adoptionFormQuestions");
    const o = useTranslations("adoptionFormOptions");
    const router = useRouter();
    const {isLoaded, user}  = useUser();
    const searchParams = useSearchParams();
    const pet_id = searchParams.get("id") || "";
    const imageUrl = searchParams.get("imageUrl") || "";
    const species = searchParams.get("species") || "";

    const loadSavedFormData = () => {
        try {
            const savedData = localStorage.getItem('adoptionFormData');
            if (savedData) {
                return JSON.parse(savedData);
            }
        } catch (error) {
            console.error('Error loading saved form data:', error);
        }
        return null;
    };

    const saveFormData = (data: Inputs) => {
        try {
            localStorage.setItem('adoptionFormData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    };

    const [inputs, setInputs] = useState<Inputs>(() => {
        const savedData = loadSavedFormData();
        return {
            pet_id,
            imageUrl,
            species,
            user: user?.fullName || "",
            user_id: user?.id || "",
            age: savedData?.age || 0,
            phoneNumber: savedData?.phoneNumber || "",
            email: savedData?.email || user?.emailAddresses?.[0]?.emailAddress || "",
            address: savedData?.address || "",
            aptType: savedData?.aptType || "",
            petsAllowed: savedData?.petsAllowed || "",
            kids: savedData?.kids || "",
            otherAnimals: savedData?.otherAnimals || "",
            liveWith: savedData?.liveWith || "",
            employmentStatus: savedData?.employmentStatus || "",
            incomeLevel: savedData?.incomeLevel || "",
            animalsBefore: savedData?.animalsBefore || "",
            nutritionalNeeds: savedData?.nutritionalNeeds || "",
            reasonToAdoptPet: savedData?.reasonToAdoptPet || "",
            characterPreferences: savedData?.characterPreferences || "",
            lifeChangingActions: savedData?.lifeChangingActions || "",
            psychologicalDiseases: savedData?.psychologicalDiseases || "",
            tendencyToBeImpulsive: savedData?.tendencyToBeImpulsive || "",
            emotionalStability: savedData?.emotionalStability || "",
            reactionToStress: savedData?.reactionToStress || "",
            uncontrolledAnger: savedData?.uncontrolledAnger || "",
            blamesForAnger: savedData?.blamesForAnger || "",
            attitudeToSpending: savedData?.attitudeToSpending || "",
            attitudeToBadBehaviour: savedData?.attitudeToBadBehaviour || "",
            requireLove: savedData?.requireLove || "",
            isAbleToFollowSchedule: savedData?.isAbleToFollowSchedule || "",
            friendlySupport: savedData?.friendlySupport || "",
            allergyToFur: savedData?.allergyToFur || "",
            howToRaisePet: savedData?.howToRaisePet || "",
            reactionToBadAction: savedData?.reactionToBadAction || "",
            isPunishmentNecessary: savedData?.isPunishmentNecessary || ""
        }
    });

    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (isLoaded && user) {
            setInputs((prev) => ({
                ...prev,
                user: user.fullName || prev.user,
                email: user.emailAddresses[0]?.emailAddress || prev.email,
            }));
        }
    }, [isLoaded, user]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setInputs((prev) => ({
            ...prev,
            [e.target.name]: e.target.value === "yes" ? true : e.target.value === "no" ? false : e.target.value
        }));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        await saveFormData(inputs);
        try {
            const res = await fetch(`/api/adoption`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...inputs
                }),
            });

            if (res.ok) {
                router.push('/pets');
                toast({
                title: 'Успіх',
                description: "Запит успішно виконано",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Невідома помилка';

            toast({
                title: 'Помилка',
                description: message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form">
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("age")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="number"
                        placeholder={q("age")}
                        name="age"
                        min="0"
                        max="100"
                        onChange={handleChange}
                        value={inputs.age}
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("phoneNumber")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={q("phoneNumber")}
                        name="phoneNumber"
                        onChange={handleChange}
                        value={inputs.phoneNumber}
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("email")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={q("email")}
                        name="email"
                        onChange={handleChange}
                        value={inputs.email}
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("address")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={q("address")}
                        name="address"
                        onChange={handleChange}
                        value={inputs.address}
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("aptType")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="aptType"
                        value={inputs.aptType}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("rentFlat")}>{o("rentFlat")}</option>
                        <option value={o("rentHouse")}>{o("rentHouse")}</option>
                        <option value={o("ownFlat")}>{o("ownFlat")}</option>
                        <option value={o("ownHouse")}>{o("ownHouse")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("petsAllowed")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="petsAllowed"
                        value={inputs.petsAllowed}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("yes")}>{o("yes")}</option>
                        <option value={o("no")}>{o("no")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("kids")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="kids"
                        value={inputs.kids}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("yes")}>{o("yes")}</option>
                        <option value={o("no")}>{o("no")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("otherAnimals")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={q("otherAnimals")}
                        name="otherAnimals"
                        onChange={handleChange}
                        value={inputs.otherAnimals}
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("liveWith")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="liveWith"
                        value={inputs.liveWith}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("alone")}>{o("alone")}</option>
                        <option value={o("family")}>{o("family")}</option>
                        <option value={o("friends")}>{o("friends")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("employmentStatus")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="employmentStatus"
                        value={inputs.employmentStatus}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("employed")}>{o("employed")}</option>
                        <option value={o("student")}>{o("student")}</option>
                        <option value={o("unemployed")}>{o("unemployed")}</option>
                        <option value={o("retired")}>{o("retired")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("incomeLevel")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="incomeLevel"
                        value={inputs.incomeLevel}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("lessThanFiveHundred")}>{o("lessThanFiveHundred")}</option>
                        <option value="500-1000$">500-1000$</option>
                        <option value="1000-2000$">1000-2000$</option>
                        <option value={o("moreThanTwoThousand")}>{o("moreThanTwoThousand")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("animalsBefore")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="animalsBefore"
                        value={inputs.animalsBefore}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("yes")}>{o("yes")}</option>
                        <option value={o("no")}>{o("no")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("nutritionalNeeds")}</label>
                    <input
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        type="text"
                        placeholder={q("nutritionalNeeds")}
                        name="nutritionalNeeds"
                        onChange={handleChange}
                        value={inputs.nutritionalNeeds}
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("reasonToAdoptPet")}</label>
                    <textarea
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        name="reasonToAdoptPet"
                        onChange={handleChange}
                        value={inputs.reasonToAdoptPet}
                    ></textarea>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("characterPreferences")}</label>
                    <textarea
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        name="characterPreferences"
                        onChange={handleChange}
                        value={inputs.characterPreferences}
                    ></textarea>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("lifeChangingActions")}</label>
                    <textarea
                        className="ring-1 ring-orange-700 p-4 rounded-sm placeholder:text-orange-700 outline-none"
                        name="lifeChangingActions"
                        onChange={handleChange}
                        value={inputs.lifeChangingActions}
                    ></textarea>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("psychologicalDiseases")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="psychologicalDiseases"
                        value={inputs.psychologicalDiseases}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("yes")}>{o("yes")}</option>
                        <option value={o("no")}>{o("no")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("tendencyToBeImpulsive")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="tendencyToBeImpulsive"
                        value={inputs.tendencyToBeImpulsive}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("yes")}>{o("yes")}</option>
                        <option value={o("no")}>{o("no")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("emotionalStability")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="emotionalStability"
                        value={inputs.emotionalStability}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("yes")}>{o("yes")}</option>
                        <option value={o("no")}>{o("no")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("reactionToStress")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="reactionToStress"
                        value={inputs.reactionToStress}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("calm")}>{o("calm")}</option>
                        <option value={o("worry")}>{o("worry")}</option>
                        <option value={o("panic")}>{o("panic")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("uncontrolledAnger")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="uncontrolledAnger"
                        value={inputs.uncontrolledAnger}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("yes")}>{o("yes")}</option>
                        <option value={o("no")}>{o("no")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("blamesForAnger")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="blamesForAnger"
                        value={inputs.blamesForAnger}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("yes")}>{o("yes")}</option>
                        <option value={o("no")}>{o("no")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("attitudeToSpending")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="reactionToStress"
                        value={inputs.attitudeToSpending}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("ready")}>{o("ready")}</option>
                        <option value={o("notSure")}>{o("notSure")}</option>
                        <option value={o("notReady")}>{o("notReady")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("attitudeToBadBehaviour")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="attitudeToBadBehaviour"
                        value={inputs.attitudeToBadBehaviour}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("patience")}>{o("patience")}</option>
                        <option value={o("refuse")}>{o("refuse")}</option>
                        <option value={o("noIdea")}>{o("noIdea")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("requireLove")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="requireLove"
                        value={inputs.requireLove}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("yes")}>{o("yes")}</option>
                        <option value={o("no")}>{o("no")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("isAbleToFollowSchedule")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="isAbleToFollowSchedule"
                        value={inputs.isAbleToFollowSchedule}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("yes")}>{o("yes")}</option>
                        <option value={o("no")}>{o("no")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("friendlySupport")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="friendlySupport"
                        value={inputs.friendlySupport}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("yes")}>{o("yes")}</option>
                        <option value={o("no")}>{o("no")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("allergyToFur")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="allergyToFur"
                        value={inputs.allergyToFur}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("yes")}>{o("yes")}</option>
                        <option value={o("no")}>{o("no")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("howToRaisePet")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="howToRaisePet"
                        value={inputs.howToRaisePet}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("positive")}>{o("positive")}</option>
                        <option value={o("strict")}>{o("strict")}</option>
                        <option value={o("noIdea")}>{o("noIdea")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("reactionToBadAction")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="reactionToBadAction"
                        value={inputs.reactionToBadAction}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("fix")}>{o("fix")}</option>
                        <option value={o("insult")}>{o("insult")}</option>
                        <option value={o("punish")}>{o("punish")}</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm">{q("isPunishmentNecessary")}</label>
                    <select
                        className="ring-1 ring-orange-700 p-4 rounded-sm outline-none"
                        name="isPunishmentNecessary"
                        value={inputs.isPunishmentNecessary}
                        onChange={handleChange}
                    >
                        <option value="">{o("select")}</option>
                        <option value={o("yes")}>{o("yes")}</option>
                        <option value={o("no")}>{o("no")}</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-orange-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center"
                >
                    {isLoading ? o("creating") : o("submit")}
                </button>
            </form>
        </div>

    );
};

export default AdoptionForm;
