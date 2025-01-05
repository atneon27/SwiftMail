import "@/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import KBar from "../components/kbar";

export const metadata: Metadata = {
  title: "SwiftMail",
  description: "Prototype for a Minimalist Email Client powered by AI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
        <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <TRPCReactProvider>
                <KBar>
                  {children}
                </KBar>
              </TRPCReactProvider>
            </ThemeProvider>
          </body>
        </html>
    </ClerkProvider>
  );
}
