import React, { useEffect, useState } from "react";
import VerticalCard from "./verticalcard";
import { Site } from "@/models/Site";
import Link from "next/link";
import Button from "./button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useUser } from "../context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSite } from "../context/SiteContext";

function SiteCard({ site }: { site: Site }) {
  const { user, favorites, setFavorites } = useUser();
  const { setLoading } = useSite();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isArchived, setIsArchived] = useState<boolean>(false);

  useEffect(() => {
    if (user && favorites) {
      setIsFavorite(favorites.some((favorite) => favorite._id === site._id));
    }
    if (site.archived) {
      setIsArchived(true);
    }
  }, [favorites, site._id, user, site.archived]);

  const toggleFavorite = async () => {
    if (!user) return;

    setLoading(true);
    const newFavorites = isFavorite
      ? favorites.filter((favorite) => favorite._id !== site._id)
      : [...favorites, site];

    try {
      if (isFavorite) {
        await axios.post("/api/users/removefavorite", {
          uid: user._id,
          siteId: site._id,
        });
      } else {
        await axios.post("/api/users/addfavorite", {
          uid: user._id,
          siteId: site._id,
        });
      }
      setFavorites(newFavorites);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorite status:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleArchive = async () => {
    setLoading(true);

    try {
      if (isArchived) {
        await axios.post("/api/sites/unarchivesite", {
          site,
        });
        setIsArchived(false);
      } else {
        await axios.post("/api/sites/archivesite", {
          site,
        });
        setIsArchived(true);
      }
    } catch (error) {
      console.log("Error archiving site", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <VerticalCard
        className={cn(
          "overflow-hidden group",
          isArchived ? "opacity-50" : "opacity-100"
        )}>
        <>
          <header className="text-center w-full relative">
            <h3 className="text-md font-bold whitespace-nowrap text-ellipsis overflow-hidden w-full">
              {site.title}
            </h3>
            {user && (
              // <Button
              //   variant="ghost"
              //   onClick={toggleFavorite}
              //   className="absolute right-0 top-1/2 -translate-y-1/2 sm:hidden sm:group-hover:block">
              //   <FontAwesomeIcon
              //     icon={isFavorite ? faStarSolid : faStarReg}
              //     size="lg"
              //   />
              <DropdownMenu>
                <DropdownMenuTrigger className="absolute right-0 top-1/2 -translate-y-1/2 p-2 ring-0 outline-none">
                  <FontAwesomeIcon
                    className="cursor-pointer sm:hidden sm:group-hover:block"
                    icon={faEllipsisV}
                    size="lg"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={toggleFavorite}>
                    {isFavorite ? "Remove Favorite" : "Favorite"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleArchive}>
                    {isArchived ? "Unarchive" : "Archive"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              // </Button>
            )}
          </header>
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
            <Button className="w-full" disabled={isArchived}>
              Manage
            </Button>
          </Link>
        </>
      </VerticalCard>
    </>
  );
}

export default SiteCard;
