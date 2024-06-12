"use client";

import { Input } from "@/components/ui/input";
import { Site } from "@/models/Site";
import { useEffect, useState } from "react";
import Button from "../components/button";
import Link from "next/link";
import VerticalCard from "../components/verticalcard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavDrawer from "../components/navdrawer";
import Spinner from "../components/spinner";

export default function Home() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/sites/getsites");
        const data = await res.json();
        setSites(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch sites", error);
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  return (
    <>
      {loading && <Spinner />}
      <main className="flex flex-col gap-5 h-full">
        <nav className="flex justify-between h-8 px-2 mt-2">
          <NavDrawer>
            <FontAwesomeIcon
              className="cursor-pointer sm:hidden"
              icon={faBars}
              size="xl"
            />
          </NavDrawer>
          <Button>New Site</Button>
        </nav>
        <div className="px-2">
          <Input placeholder="Search..." className="w-[300px] m-auto" />
        </div>
        <div className="flex flex-col px-5 items-center h-full overflow-y-auto">
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
                      href={site.testURL}
                      target="_blank"
                      className="underline">
                      {site.testURL}
                    </a>
                  </p>
                  <p className="overflow-hidden text-ellipsis">
                    <strong>Live URL:</strong>{" "}
                    <a
                      href={site.liveURL}
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
