import Featured from "@/app/components/Featured";
import PetLayout from "@/app/layouts/PetLayout";

export default async function Pets() {
    return (
        <main>
            <PetLayout>
                    <Featured />
            </PetLayout>
        </main>
    );
}


