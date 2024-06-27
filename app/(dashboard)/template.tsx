"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import NavDrawer from "../components/navdrawer";
import Spinner from "../components/spinner";
import { UserProvider, useUser } from "../context/UserContext";

export default function Template({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getMe = async () => {
      setLoading(true);
      const me = await axios.get("/api/auth/me");
      setLoading(false);
      setUser(me.data.user);
    };

    getMe();
  }, [setUser]);

  return (
    <>
      {loading && <Spinner />}
      <main className="flex flex-col h-full sm:flex-row">
        <NavDrawer />
        {children}
      </main>
    </>
  );
}
