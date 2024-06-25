"use client";

import { Input } from "@/components/ui/input";
import { Site } from "@/models/Site";
import { useCallback, useEffect, useState } from "react";
import Button from "../components/button";
import Link from "next/link";
import VerticalCard from "../components/verticalcard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import NavDrawer, { SimpleUser } from "../components/navdrawer";
import Spinner from "../components/spinner";
import { NewSiteDialog } from "../components/dialogs";
import axios from "axios";
import SiteCard from "../components/siteCard";

export default function Home() {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getMe = async () => {
      const me = await axios.get("/api/auth/me");
      setUser(me.data.user);
    };

    getMe();
  }, []);

  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true);
      try {
        const res = await axios.post("/api/sites/getsites", {
          search: "",
        });

        setSites(res.data.sites);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch sites", error);
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const searchSites = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.post("/api/sites/getsites", {
        search,
      });

      setSites(res.data.sites);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch sites", error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <main className="flex flex-col gap-5 h-full sm:flex-row">
        <NavDrawer user={user} />
        <div className="flex flex-col w-full gap-5">
          <nav className="flex justify-between h-8 px-2 mt-2 items-center sm:justify-end sm:h-auto">
            <NavDrawer user={user}>
              <FontAwesomeIcon
                className="cursor-pointer w-5 h-auto"
                icon={faBars}
              />
            </NavDrawer>

            <form
              onClick={searchSites}
              className="px-2 hidden relative sm:flex">
              <Input
                placeholder="Search..."
                className="w-[300px] rounded-r-none"
                onChange={handleSearchChange}
              />
              <Button
                variant="filled"
                type="submit"
                className="bg-primary rounded-l-none">
                <FontAwesomeIcon icon={faPaperPlane} className="w-4" />
              </Button>
            </form>
            <NewSiteDialog>
              <Button className="sm:h-full">New Site</Button>
            </NewSiteDialog>
          </nav>
          <form
            onClick={searchSites}
            className="px-2 flex mx-auto relative sm:hidden">
            <Input
              placeholder="Search..."
              className="w-[300px] rounded-r-none"
              onChange={handleSearchChange}
            />
            <Button
              variant="filled"
              type="submit"
              className="bg-primary rounded-l-none">
              <FontAwesomeIcon icon={faPaperPlane} className="w-4" />
            </Button>
          </form>
          <section className="h-full flex flex-col items-center overflow-hidden sm:justify-around">
            <div className="hidden sm:flex flex-col gap-5 px-5 items-center overflow-y-auto sm:flex-row h-fit w-full min-h-[350px]">
              <h3 className="-rotate-90 hidden sm:block w-3">Favorites</h3>
              <div className="flex flex-col gap-2 w-full items-center h-full overflow-y-auto sm:flex-row sm:justify-start">
                {user?.favorites.map((site) => (
                  <SiteCard
                    key={site._id}
                    site={site}
                    user={user}
                    setUser={setUser}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-5 px-5 items-center overflow-y-auto sm:flex-row w-full h-full sm:h-fit min-h-[350px]">
              <h3 className="-rotate-90 hidden sm:block w-3">Results</h3>
              <div className="flex flex-col gap-2 w-full items-center h-full overflow-y-auto sm:flex-row sm:justify-start">
                {user && (
                  <>
                    {sites.map((site) => (
                      <SiteCard
                        key={site._id}
                        site={site}
                        user={user}
                        setUser={setUser}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
