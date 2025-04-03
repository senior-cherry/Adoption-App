import { Providers } from './providers'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import {ClerkProvider} from "@clerk/nextjs";
import Footer from "@/app/components/Footer";
import AIHelper from './components/AIHelper';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Paw in Paw: House of Friendship",
  description: "Adoption App",
};

export default async function RootLayout({
                                           children,
                                         }: Readonly<{
  children: React.ReactNode;
}>) {
    const locale = await getLocale();
    const messages = await getMessages();

  return (
      <ClerkProvider>
        <html lang={locale}>
        <NextIntlClientProvider messages={messages}>
        <body className={inter.className} suppressHydrationWarning={true}>
          <Providers>
            <Header/>
            <main className="min-h-screen">{children}</main>
            <AIHelper />
            <Footer/>
          </Providers>
        </body>
        </NextIntlClientProvider>
        </html>
      </ClerkProvider>
  );
}

