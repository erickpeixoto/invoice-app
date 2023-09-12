import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import { headers } from "next/headers";
import { ClerkProvider } from "@clerk/nextjs";

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
        <div className="flex h-screen flex-col bg-blue-100 p-5 md:flex-row">
          <SideBar />
          <div className="flex-1 overflow-y-auto p-4 md:p-10">
            <TRPCReactProvider headers={headers()}>
              <ClerkProvider>{props.children}</ClerkProvider>
            </TRPCReactProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
