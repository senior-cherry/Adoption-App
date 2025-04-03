import Filter from "@/app/components/Filter";

const PetLayout = ({ children }: any) => {
    return (
        <div className="mx-auto">
            <Filter />
            {children}
        </div>
    );
}

export default PetLayout;