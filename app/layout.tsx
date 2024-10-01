import { type ReactNode } from "react";
import type { Metadata } from "next";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { AppProviders } from "./providers";
import { Navbar } from "./components/Navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { siteConfig } from "../config/site";

export const metadata: Metadata = {
  title: "Swap Gasless",
  description: "Swap gasless on the Ethereum network",
};

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <AppProviders>
          <header className="px-6 z-40 mx-auto bg-background">
            <div className="flex h-20 items-center justify-between py-6">
              <Navbar items={siteConfig.mainNav} />
              <nav>
                <ConnectButton />
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}

export default RootLayout;
