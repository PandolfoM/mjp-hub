"use client";

import { SiteProvider } from "../context/SiteContext";
import { UserProvider } from "../context/UserContext";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <SiteProvider>{children}</SiteProvider>
    </UserProvider>
  );
}
