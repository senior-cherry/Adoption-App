"use client";
import React from "react";
import {Button} from "@chakra-ui/react";
import {useRouter} from "next/navigation";

const BackButton = ({ children }: React.PropsWithChildren) => {
    const router = useRouter();
    return (
        <Button variant="ghost" colorScheme="blue" onClick={() => {router.back()}}>
            {children}
        </Button>
    );
}

export default BackButton;