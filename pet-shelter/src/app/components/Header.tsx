"use client";

import {Image, Flex, Button, HStack, Box} from '@chakra-ui/react';
import Link from "next/link";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";


const Header = () => {
    return (
        <Box className="header">
            <Flex
                w="100%"
                px="6"
                py="5"
                align="center"
                justify="space-between"
            >
                <Image src='/uploads/logo_w_bg-removebg-preview.png' alt='Paw in Paw' width="150" height="75" />
                <HStack as="nav" spacing="5" fontSize={32} letterSpacing={2}>
                        <Link href="/">
                            <Button variant="nav">Про нас</Button>
                        </Link>
                    <Link href="/">
                        <Button variant="nav">Улюбленці</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="nav">Блог</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="nav">Адмінпанель</Button>
                    </Link>
                </HStack>
                <HStack>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </HStack>
            </Flex>
        </Box>
    );
}

export default Header;