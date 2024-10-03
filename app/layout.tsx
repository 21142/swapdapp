import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata, Viewport } from "next";
import { type ReactNode } from "react";
import { siteConfig } from "../config/site";
import "../styles/globals.css";
import { Navbar } from "./components/Navbar";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: "Swap Gasless",
  description: "Swap gasless on the Ethereum network",
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

interface RootLayoutProps {
  children: ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="-z-10 background--custom absolute inset-0 w-full h-full min-w-screen min-h-screen" />
        <AppProviders>
          <header className="px-8 z-40 xl:container mx-auto">
            <div className="flex h-20 items-center justify-between py-6">
              <Navbar items={siteConfig.mainNav} />
              <nav>
                <ConnectButton />
              </nav>
            </div>
          </header>
          <main className="xl:container mx-auto">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}

export default RootLayout;
