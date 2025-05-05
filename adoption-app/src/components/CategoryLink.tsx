"use client";
import {usePathname} from "next/navigation";
import Link from "next/link";

const CategoryLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={`w-full h-1/3 bg-cover p-8 md:h-1/2 ${isActive ? "active" : ""}`}>
            {children}
        </Link>
    );
};

export default CategoryLink;