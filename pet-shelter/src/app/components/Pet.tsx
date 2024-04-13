interface Pet {
    id: string,
    name: string,
    species: string,
    age: string,
    skills: string[],
    categoryName: string
}
export default function Pet({id, name, species, age, skills, categoryName}: Pet) {
    return (
        <div className="pet">
            <h3>Name: {name}</h3>
            <h4>Species: {species}</h4>
            <h4>Age: {age}</h4>
            <p>Category: {categoryName}</p>
            {/*<div className="actions">*/}
            {/*    <UpdatePetButton petId={id} />*/}
            {/*    <DeletePetButton petId={id} />*/}
            {/*</div>*/}
        </div>
    );
}