"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import NavDrawer from "../components/navdrawer";
import Spinner from "../components/spinner";
import { useUser } from "../context/UserContext";

export default function Template({ children }: { children: React.ReactNode }) {
  const { setUser } = useUser();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getMe = async () => {
      setLoading(true);
      try {
        const me = await axios.get("/api/auth/me");
        setUser(me.data.user);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setUser({
          _id: "0",
          email: "",
          favorites: [],
          name: "",
          tempPassword: false,
        });
        setLoading(false);
      }
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
