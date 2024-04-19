export type Category = {
    id: string;
    name: string,
    description: string,
    pets: Pet[]
}[];

export type Pet = {
    id: string,
    name: string,
    species: string,
    age: string,
    skills: [],
    imageUrl: string,
    isFeatured: boolean,
    category: Category,
    catSlug: string
}