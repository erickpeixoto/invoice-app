import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "~/components/ui/toaster";

import "~/styles/globals.css";

import { headers } from "next/headers";
import { ClerkProvider } from "@clerk/nextjs";

import NavBar from "~/components/NavBar";
import SideBar from "~/components/SideBar";
import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "in.voice",
  description: "in.voice - Invoicing for the modern freelancer",
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* Additional <head> elements can be added here. */}</head>
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <Toaster />
        <div className="flex h-screen flex-col bg-blue-100 p-5 md:flex-row">
          <SideBar />
          <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-10">
            <NavBar />
            <TRPCReactProvider headers={headers()}>
              <ClerkProvider>{props.children}</ClerkProvider>
            </TRPCReactProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
