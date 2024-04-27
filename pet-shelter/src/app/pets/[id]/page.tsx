import {Params} from "next/dist/shared/lib/router/utils/route-matcher";

// @ts-ignore
const PetById = ({ params }) => {
    return (
        <div>
            <h1>{params.id}</h1>
        </div>
    );
}