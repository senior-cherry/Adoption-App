"use client";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LanguageSwitcher = () => {
    const router = useRouter();
    const [locale, setLocale] = useState("uk");

    useEffect(() => {
        const savedLocale = document.cookie
            .split("; ")
            .find(row => row.startsWith("locale="))
            ?.split("=")[1];

        if (savedLocale) setLocale(savedLocale);
    }, []);

    const onSelectChange = (nextLocale: string) => {
        document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
        setLocale(nextLocale);
        router.refresh();
    };

    return (
        <ButtonGroup isAttached variant="solid">
            <Button onClick={() => onSelectChange("uk")} colorScheme={locale === "uk" ? "orange" : "gray"}>
                Українська
            </Button>
            <Button onClick={() => onSelectChange("en")} colorScheme={locale === "en" ? "orange" : "gray"}>
                English
            </Button>
        </ButtonGroup>
    );
};

export default LanguageSwitcher;
