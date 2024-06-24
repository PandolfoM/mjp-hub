import React from "react";
import VerticalCard from "./verticalcard";
import { Site } from "@/models/Site";
import Link from "next/link";
import Button from "./button";

function SiteCard({ site }: { site: Site }) {
  return (
    <VerticalCard className="overflow-hidden">
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
  );
}

export default SiteCard;
