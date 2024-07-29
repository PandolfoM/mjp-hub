import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./fonts";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className={`h-full w-full ${inter.className}`}>
        <TooltipProvider delayDuration={0}>
          <Toaster richColors />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
