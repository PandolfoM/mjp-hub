"use client";

import { Input } from "@/components/ui/input";
import { Site } from "@/models/Site";
import { useCallback, useEffect, useState } from "react";
import Button from "../components/button";
import Link from "next/link";
import VerticalCard from "../components/verticalcard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import NavDrawer from "../components/navdrawer";
import Spinner from "../components/spinner";
import { NewSiteDialog } from "../components/dialogs";
import axios from "axios";

export default function Home() {
  const [sites, setSites] = useState<Site[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
      <main className="flex flex-col gap-5 h-full">
        <nav className="flex justify-between h-8 px-2 mt-2 items-center">
          <NavDrawer>
            <FontAwesomeIcon
              className="cursor-pointer sm:hidden w-5 h-auto"
              icon={faBars}
            />
          </NavDrawer>
          <NewSiteDialog>
            <Button>New Site</Button>
          </NewSiteDialog>
        </nav>
        <form onClick={searchSites} className="px-2 flex mx-auto relative">
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
        <div className="flex flex-col gap-2 px-5 items-center h-full overflow-y-auto">
          {sites.map((site) => (
            <VerticalCard key={site._id} className="overflow-hidden">
              <>
                <h3 className="text-md font-bold whitespace-nowrap text-ellipsis overflow-hidden text-center w-full">
                  {site.title}
                </h3>
                <div className="text-md text-left flex flex-col gap-2 flex-1 whitespace-nowrap w-full">
                  <p className="overflow-hidden text-ellipsis">
                    <strong>Repository:</strong>{" "}
                    <a href={site.repo} target="_blank" className="underline">
                      {site.repo}
                    </a>
                  </p>
                  <p className="overflow-hidden text-ellipsis">
                    <strong>Test URL:</strong>{" "}
                    <a
                      href={`https://${site.testURL}`}
                      target="_blank"
                      className="underline">
                      {site.testURL}
                    </a>
                  </p>
                  <p className="overflow-hidden text-ellipsis">
                    <strong>Live URL:</strong>{" "}
                    <a
                      href={`https://${site.liveURL}`}
                      target="_blank"
                      className="underline">
                      {site.liveURL}
                    </a>
                  </p>
                </div>
                <Link href={`/manage/${site._id}`} className="w-full">
                  <Button className="w-full">Manage</Button>
                </Link>
              </>
            </VerticalCard>
          ))}
        </div>
      </main>
    </>
  );
}
