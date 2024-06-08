"use client";

import Button from "@/app/components/button";
import VerticalCard from "@/app/components/verticalcard";
import { Site } from "@/models/Site";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [site, setSite] = useState<Site>();

  useEffect(() => {
    const fetchSite = async () => {
      try {
        await fetch("/api/sites/getsite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: params.id }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setSite(data.data);
            } else {
              router.replace("/");
            }
          })
          .catch(() => router.replace("/"));
      } catch (error) {
        console.error("Failed to fetch sites", error);
      }
    };

    fetchSite();
  }, [params.id, router]);

  return (
    <div className="flex flex-col gap-5 h-full">
      <nav className="flex justify-end h-8 px-2 mt-2">
        <Button>Deployments</Button>
      </nav>
      <div className="flex items-center gap-2 flex-col h-full p-2">
        <VerticalCard className="min-h-full min-w-full">
          <>
            <nav className="flex items-center gap-4">
              <h3 className="text-lg font-bold whitespace-nowrap text-ellipsis overflow-hidden text-center w-full">
                {site?.title}
              </h3>
              <Button variant="ghost" className="text-sm">Edit</Button>
            </nav>
          </>
        </VerticalCard>
      </div>
    </div>
  );
}
