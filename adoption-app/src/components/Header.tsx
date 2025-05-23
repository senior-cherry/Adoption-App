"use client";
import {
    Image,
    Flex,
    Button,
    HStack,
    Box,
    Menu,
    MenuButton,
    IconButton,
    MenuList,
    MenuItem,
    Divider, Spinner,
} from '@chakra-ui/react';
import {
    CalendarIcon,
    HamburgerIcon,
    InfoIcon,
    SearchIcon,
    SettingsIcon,
    ChatIcon
} from "@chakra-ui/icons";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Link from "next/link";
import dynamic from "next/dynamic";

const AuthButtons = dynamic(() => import("./AuthButtons"), {
    ssr: false,
    loading: () => (
        <Box minW="60px" minH="40px" display="flex" alignItems="center" justifyContent="center">
            <Spinner size="sm" />
        </Box>
    ),
});

const Header = () => {
    return (
        <Box className="header" w="100%">
            <Flex
                w="100%"
                px="6"
                py="5"
                align="center"
                justify="space-between"
            >
                <Link href="/">
                    <Box w="260px" h="60px">
                        <Image
                            src="/uploads/logo_w_bg-removebg-preview.png"
                            alt="Paw in Paw"
                            width="100%"
                            height="100%"
                            objectFit="cover"
                        />
                    </Box>
                </Link>

                <Box className="mobile-menu" display={{ base: "block", xl: "none" }}>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label='Options'
                            icon={<HamburgerIcon />}
                        />
                        <MenuList>
                            <Box marginLeft={2}>
                                <AuthButtons />
                            </Box>

                            <Divider my={2} />

                            <Link href="/about"><MenuItem icon={<InfoIcon />} color="black">Про нас</MenuItem></Link>
                            <Link href="/pets"><MenuItem icon={<SearchIcon />} color="black">Улюбленці</MenuItem></Link>
                            <Link href="/blog"><MenuItem icon={<CalendarIcon />} color="black">Блог</MenuItem></Link>
                            <Link href="/chat"><MenuItem icon={<ChatIcon />} color="black">Чат</MenuItem></Link>
                            <Link href="/dashboard"><MenuItem icon={<SettingsIcon />} color="black">Адмінпанель</MenuItem></Link>

                            <Divider my={2} />

                            <Box px={4} py={2}>
                                <LanguageSwitcher />
                            </Box>
                        </MenuList>
                    </Menu>
                </Box>

                <HStack
                    as="nav"
                    spacing="5"
                    fontSize={32}
                    letterSpacing={2}
                    className="menu"
                    display={{ base: "none", xl: "flex" }}
                >
                    <Link href="/about"><Button variant="nav">Про нас</Button></Link>
                    <Link href="/pets"><Button variant="nav">Улюбленці</Button></Link>
                    <Link href="/blog"><Button variant="nav">Блог</Button></Link>
                    <Link href="/chat"><Button variant="nav">Чат</Button></Link>
                    <Link href="/dashboard"><Button variant="nav">Адмінпанель</Button></Link>
                </HStack>

                <HStack display={{ base: "none", xl: "flex" }}>
                    <LanguageSwitcher />
                </HStack>
                <HStack display={{ base: "none", xl: "flex" }}>
                    <AuthButtons />
                </HStack>
            </Flex>
        </Box>
    );
}

export default Header;
