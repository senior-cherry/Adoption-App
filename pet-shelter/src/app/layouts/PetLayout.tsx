import Filter from "@/app/components/Filter";

const PetLayout = ({ children }: any) => {
    return (
        <div className="m-12">
            <Filter />
            {children}
        </div>
    );
}

export default PetLayout;