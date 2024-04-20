export type CategoryType = {
    id: string;
    name: string,
    description: string,
    pets: PetType[]
}[];

export type PetType = {
    id: string,
    name: string,
    species: string,
    age: string,
    skills: [],
    imageUrl: string,
    isFeatured: boolean,
    category: CategoryType,
    catSlug: string
};