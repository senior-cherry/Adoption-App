"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Box, Button } from "@chakra-ui/react";
import { useLocale } from 'next-intl';

const AuthButtons = () => {
    const locale = useLocale();
    return (
        <Box>
            <SignedOut>
                <SignInButton
                    mode="modal"
                    key={`signin-${locale}`}
                >
                    <Button colorScheme="teal" size="sm">
                        {locale === 'uk' ? "Увійти" : "Sign in"}
                    </Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </Box>
    );
};

export default AuthButtons;