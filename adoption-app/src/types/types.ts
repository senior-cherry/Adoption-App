export type CategoryType = {
    id: string;
    name: string,
    description: string,
    pets: PetType[]
};

export type PetType = {
    id: string,
    name: string,
    species: string,
    age: string,
    gender: string,
    desc: string,
    imageUrl: string,
    isFeatured: boolean,
    category: CategoryType,
    catSlug: string
};

export type PostType = {
    id: string,
    name: string,
    description: string,
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
