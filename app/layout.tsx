import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MJP Hub",
  description: "Hub for MJP Web Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark dark:bg-black dark:text-white h-full w-full">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
