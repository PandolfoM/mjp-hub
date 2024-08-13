"use client";

import { Input } from "@/components/ui/input";
import { Site } from "@/models/Site";
import { useEffect, useState } from "react";
import Button from "../../components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import NavDrawer from "../../components/navdrawer";
import { NewSiteDialog } from "../../components/dialogs";
import axios from "axios";
import SiteCard from "../../components/siteCard";
import { useUser } from "../../context/UserContext";
import { useSite } from "../../context/SiteContext";
import { Permissions } from "@/utils/permissions";

export default function Home() {
  const { setLoading } = useSite();
  const { hasPermission } = useUser();
  const { user, favorites } = useUser();
  const [sites, setSites] = useState<Site[]>([]);
  const [search, setSearch] = useState<string>("");

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
  }, [setLoading]);

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
      <div className="flex flex-col h-full w-full gap-5 p-2 sm:p-5 overflow-hidden">
        <nav className="flex justify-between items-center sm:justify-end sm:h-auto gap-2">
          <NavDrawer>
            <FontAwesomeIcon
              className="cursor-pointer w-5 h-auto"
              icon={faBars}
            />
          </NavDrawer>

          <form onSubmit={searchSites} className="px-2 hidden relative sm:flex">
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
            {(hasPermission(Permissions.Admin) ||
              hasPermission(Permissions.Developer)) && (
              <Button className="sm:h-full whitespace-nowrap h-full">
                New Site
              </Button>
            )}
          </NewSiteDialog>
        </nav>

        <section className="h-full flex flex-col items-center gap-1 overflow-y-auto sm:justify-around heightSm:pt-10 heightXs:pt-20 heightXxs:pt-32">
          <div className="hidden sm:flex flex-col gap-5 items-center sm:flex-row h-fit w-full min-h-[350px]">
            <h3 className="-rotate-90 hidden sm:block w-3">Favorites</h3>
            <div className="flex flex-col gap-2 w-full items-center h-full overflow-y-auto sm:flex-row sm:justify-start">
              {favorites?.map((site) => (
                <SiteCard key={site._id} site={site} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5 items-center sm:flex-row w-full h-full sm:h-fit min-h-[350px]">
            <h3 className="-rotate-90 hidden sm:block w-3">Results</h3>
            <div className="flex flex-col gap-2 w-full items-center h-full overflow-y-auto sm:flex-row sm:justify-start sm:overflow-x-auto">
              {user && (
                <>
                  {sites.map((site) => (
                    <SiteCard key={site._id} site={site} />
                  ))}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
