import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "ShopWave — Modern E-Commerce",
    template: "%s | ShopWave",
  },
  description:
    "Discover thousands of products with the best prices. Built with Next.js, React, Framer Motion and TanStack Query.",
  keywords: ["e-commerce", "shop", "products", "nextjs", "react"],
  openGraph: {
    title: "ShopWave",
    description: "Modern e-commerce built with Next.js 14",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen flex flex-col font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t py-8 mt-12">
            <div className="container px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2025 ShopWave. Built with Next.js 14 + Framer Motion.</p>
              <p>Data from DummyJSON API</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
