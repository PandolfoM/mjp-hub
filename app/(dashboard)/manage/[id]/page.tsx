"use client";

import Button from "@/app/components/button";
import VerticalCard from "@/app/components/verticalcard";
import { Site } from "@/models/Site";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [site, setSite] = useState<Site>();
  const [isEdit, setIsEdit] = useState<boolean>(false);

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

  const NotEditing = ({ site }: { site: Site }) => {
    return (
      <>
        <nav className="flex items-center justify-between gap-4 w-full">
          <div className="flex gap-4">
            <h3 className="text-lg font-bold whitespace-nowrap text-ellipsis overflow-hidden text-center w-full">
              {site.title}
            </h3>
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => setIsEdit(true)}>
              Edit
            </Button>
          </div>
          <p className="text-xs">ID: {site._id}</p>
        </nav>
        <div className="flex flex-col gap-2">
          <p>
            <strong>Repository: </strong>
            <Link href={site.repo}>
              <Button variant="ghost">{site.repo}</Button>
            </Link>
          </p>
          <p>
            <strong>Test URL: </strong>
            <Link href={site.testURL}>
              <Button variant="ghost">{site.testURL}</Button>
            </Link>
          </p>
          <p>
            <strong>Live URL: </strong>
            <Link href={site.liveURL}>
              <Button variant="ghost">{site.liveURL}</Button>
            </Link>
          </p>
        </div>
      </>
    );
  };

  const Editing = ({ site }: { site: Site }) => {
    return (
      <div className="flex flex-col gap-2 h-full w-full">
        <div className="flex-1">test</div>
        <footer className="flex gap-4">
          <Button
            variant="cancel"
            className="w-24"
            onClick={() => setIsEdit(false)}>
            Cancel
          </Button>
          <Button variant="success" className="w-24">
            Save
          </Button>
        </footer>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      <nav className="flex justify-between h-8 px-2 mt-2 items-center">
        <a onClick={() => router.back()} className="cursor-pointer">
          <FontAwesomeIcon icon={faChevronLeft} /> Back
        </a>
        <Button>Deployments</Button>
      </nav>
      <div className="flex items-center gap-2 flex-col h-full p-2">
        {site && (
          <VerticalCard className="min-h-full min-w-full">
            <>{isEdit ? <Editing site={site} /> : <NotEditing site={site} />}</>
            {/* <Editing site={site} /> */}
          </VerticalCard>
        )}
      </div>
    </div>
  );
}
