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
  title: "aiWave",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "aiWave",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "aiWave",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* Additional <head> elements can be added here. */}</head>
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <div className="flex h-screen flex-col bg-gray-100 md:flex-row">
          <div className="shadow-r w-full bg-white md:h-screen md:w-64">
            <SideBar />
          </div>
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
