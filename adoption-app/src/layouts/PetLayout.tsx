import Filter from "@/components/Filter";
import DrawerFilter from "@/components/DrawerFilter";

const PetLayout = ({ children }: any) => {
    return (
        <div className="mx-auto">
            {/*<Filter />*/}
            <DrawerFilter />
            {children}
        </div>
    );
}

export default PetLayout;

