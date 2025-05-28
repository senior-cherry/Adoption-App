import React from "react";
import { Providers } from './providers'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import {ClerkProvider} from "@clerk/nextjs";
import Footer from "@/components/Footer";
import AIHelper from '../components/AIHelper';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import {ukUA, enUS} from "@clerk/localizations";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Paw in Paw: House of Friendship",
  description: "Adoption App",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
        <ClerkProvider localization={locale === "uk" ? ukUA : enUS}>
            <NextIntlClientProvider messages={messages}>
                <body className={inter.className} suppressHydrationWarning={true}>
                <Providers>
                    <Header />
                    <main className="min-h-screen">{children}</main>
                    <AIHelper />
                    <Footer />
                </Providers>
                </body>
            </NextIntlClientProvider>
        </ClerkProvider>
        </html>
    );
}


