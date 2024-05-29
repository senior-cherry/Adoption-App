import {AbsoluteCenter, Box, Spinner} from "@chakra-ui/react";

export default function Loader() {
    return (
    <Box position='relative' h='100vh' w='100%'>
        <AbsoluteCenter color='white' axis='both'>
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='orange.500'
                size='xl'
            />
        </AbsoluteCenter>
    </Box>
    );
}