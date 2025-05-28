import DrawerFilter from "@/components/DrawerFilter";

const PetLayout = ({ children }: any) => {
    return (
        <div className="mx-auto">
            <DrawerFilter />
            {children}
        </div>
    );
}

export default PetLayout;

