export type CategoryType = {
    id: string;
    name: string,
    engName: string,
    description: string,
    engDescription: string,
    pets: PetType[]
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
    email: string
};
