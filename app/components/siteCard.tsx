import React, { useEffect, useState } from "react";
import VerticalCard from "./verticalcard";
import { Site } from "@/models/Site";
import Link from "next/link";
import Button from "./button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useUser } from "../context/UserContext";
import Spinner from "./spinner";

function SiteCard({ site }: { site: Site }) {
  const { user, favorites, setFavorites } = useUser();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user && favorites) {
      setIsFavorite(favorites.some((favorite) => favorite._id === site._id));
    }
  }, [favorites, site._id, user]);

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

  return (
    <>
      {loading && <Spinner />}
      <VerticalCard className="overflow-hidden group">
        <>
          <header className="text-center w-full relative">
            <h3 className="text-md font-bold whitespace-nowrap text-ellipsis overflow-hidden w-full">
              {site.title}
            </h3>
            {user && (
              <Button
                variant="ghost"
                onClick={toggleFavorite}
                className="absolute right-0 top-1/2 -translate-y-1/2 sm:hidden sm:group-hover:block">
                <FontAwesomeIcon
                  icon={isFavorite ? faStarSolid : faStarReg}
                  size="lg"
                />
              </Button>
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
            <Button className="w-full">Manage</Button>
          </Link>
        </>
      </VerticalCard>
    </>
  );
}

export default SiteCard;
