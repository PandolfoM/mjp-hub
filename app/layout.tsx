import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./fonts";


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
      className="dark dark:bg-background dark:text-white h-full w-full relative">
      <body className={`h-full w-full ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
