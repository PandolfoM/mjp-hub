"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import NavDrawer, { SimpleUser } from "../components/navdrawer";

export default function Template({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SimpleUser | null>(null);

  useEffect(() => {
    const getMe = async () => {
      const me = await axios.get("/api/auth/me");
      setUser(me.data.user);
    };

    getMe();
  }, []);

  return (
    <main className="flex flex-col h-full sm:flex-row">
      <NavDrawer user={user} />
      {children}
    </main>
  );
}
