export type CategoryType = {
    id: string;
    name: string,
    engName: string,
    description: string,
    engDescription: string,
    pets: PetType[],
    slug: string
};

export type PetType = {
    id: string,
    name: string,
    engName: string,
    species: string,
    engSpecies: string,
    age: string,
    engAge: string,
    gender: string,
    engGender: string,
    desc: string,
    engDesc: string,
    imageUrl: string,
    isFeatured: boolean,
    category: CategoryType,
    catSlug: string
};

export type PostType = {
    id: string,
    name: string,
    engName: string,
    description: string,
    engDescription: string,
    imageUrl: string,
    createdAt: number | Date
};

export type AdoptionType = {
    id: string,
    pet: string,
    imageUrl: string,
    user: string,
    email: string,
    species: string,
    aiConclusion: string
};

export type Inputs = {
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