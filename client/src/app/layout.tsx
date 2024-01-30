import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WProvider from "@/wrappers/wagmiProvider";
import Query from "@/wrappers/Query";
import Header from "@/components/header";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Distortion",
  description: "stake and earn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WProvider>
          <Query>
          <Header/>
            {children}
          </Query>
        </WProvider>
        <Toaster />
        </body>
    </html>
  );
}
