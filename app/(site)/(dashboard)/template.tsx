"use client";

import axios from "axios";
import { useEffect } from "react";
import { useUser } from "../../context/UserContext";
import NavDrawer from "@/app/components/navdrawer";
import { useSite } from "@/app/context/SiteContext";

export default function Template({ children }: { children: React.ReactNode }) {
  const { user, setUser, setFavorites } = useUser();
  const { setLoading } = useSite();

  useEffect(() => {
    const getMe = async () => {
      setLoading(true);
      try {
        const me = await axios.get("/api/auth/me");
        setUser(me.data.user);

        const favs = await axios.post("/api/auth/getfavorites", {
          favs: me.data.user.favorites,
        });
        setFavorites(favs.data.favorites);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setUser(null);
        setLoading(false);
      }
    };

    !user && getMe();
  }, [user, setUser, setFavorites, setLoading]);

  return (
    <>
      <main className="flex flex-col h-full sm:flex-row">
        <NavDrawer />
        {children}
      </main>
    </>
  );
}
