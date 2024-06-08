"use client";

import { Input } from "@/components/ui/input";
import { Site } from "@/models/Site";
import { useEffect, useState } from "react";
import Button from "../components/button";
import Link from "next/link";
import VerticalCard from "../components/verticalcard";

export default function Home() {
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await fetch("/api/sites/getsites");
        const data = await res.json();
        setSites(data.data);
      } catch (error) {
        console.error("Failed to fetch sites", error);
      }
    };

    fetchSites();
  }, []);

  return (
    <main className="flex flex-col gap-5 h-full">
      <nav className="flex justify-between h-8 px-2 mt-2">
        <Input placeholder="Search..." className="w-48 h-full" />
        <Button>New Site</Button>
      </nav>
      <div className="flex flex-col px-5 items-center h-full overflow-y-auto">
        {sites.map((site) => (
          <VerticalCard key={site._id}>
            <>
              <h3 className="text-md font-bold whitespace-nowrap text-ellipsis overflow-hidden text-center w-full">
                {site.title}
              </h3>
              <div className="text-sm text-left flex flex-col gap-2 flex-1">
                <p>
                  <strong>Repository:</strong>{" "}
                  <a href={site.repo} target="_blank" className="underline">
                    {site.repo}
                  </a>
                </p>
                <p>
                  <strong>Test URL:</strong>{" "}
                  <a href={site.testURL} target="_blank" className="underline">
                    {site.testURL}
                  </a>
                </p>
                <p>
                  <strong>Live URL:</strong>{" "}
                  <a href={site.liveURL} target="_blank" className="underline">
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
  );
}
