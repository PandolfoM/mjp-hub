"use client";

import NavDrawer from "@/app/components/navdrawer";
import { useSite } from "@/app/context/SiteContext";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";

function Docs() {
  const { setLoading } = useSite();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <div className="flex flex-col h-full w-full gap-5">
      <nav className="flex justify-between h-8 px-2 mt-2 items-center">
        <NavDrawer>
          <FontAwesomeIcon
            className="cursor-pointer sm:hidden w-5 h-auto"
            icon={faBars}
          />
        </NavDrawer>
      </nav>
    </div>
  );
}

export default Docs;
