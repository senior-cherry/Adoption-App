"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {Box, Button} from "@chakra-ui/react";

const AuthButtons = () => {
    return (
        <Box>
            <SignedOut>
                <SignInButton>
                    <Button colorScheme="teal" size="sm">
                        Sign in
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

