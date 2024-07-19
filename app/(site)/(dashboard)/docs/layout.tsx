"use client";

import { useEffect, useState } from "react";
import NavDrawer from "@/app/components/navdrawer";
import { useSite } from "@/app/context/SiteContext";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Docs = [
  {
    category: "Get Started",
    pages: [
      {
        name: "Home",
        route: "",
      },
    ],
  },
  {
    category: "Deployments",
    pages: [
      {
        name: "Domain",
        route: "domain",
      },
    ],
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setLoading } = useSite();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <div className="flex flex-col h-full w-full gap-5 overflow-hidden">
      <nav className="flex flex-col justify-between items-center relative z-10">
        <div className="flex justify-between h-8 items-center px-2 py-6 w-full border-b border-white/50">
          <NavDrawer>
            <FontAwesomeIcon
              className="cursor-pointer sm:hidden w-5 h-auto"
              icon={faBars}
            />
          </NavDrawer>
        </div>
        <section className="w-full flex flex-col relative">
          <div
            className={cn(
              "gap-2 items-center w-full px-2 py-3 flex flex-col border-b border-white/30 cursor-pointer",
              isOpen && "border-none"
            )}
            onClick={() => setIsOpen(!isOpen)}>
            <p className="flex gap-2 items-center w-full select-none">
              <FontAwesomeIcon
                icon={faChevronRight}
                className={cn(
                  "h-3 transition-all ease-in-out duration-100",
                  isOpen && "rotate-90"
                )}
              />
              Menu
            </p>
          </div>
          {isOpen && (
            <motion.div
              initial={{ y: "99%", opacity: 0 }}
              animate={{ y: "100%", opacity: 1 }}
              exit={{ y: 0 }}
              className={
                "px-2 pb-28 absolute bottom-0 translate-y-full gap-2 border-b border-white/30 bg-background w-full overflow-y-auto h-dvh"
              }>
              <ul className="flex flex-col gap-2">
                {Docs.map((doc, i) => (
                  <li key={i} className="flex flex-col gap-2">
                    <p className="text-white transition-all duration-100 ease-in-out cursor-default">
                      {doc.category}
                    </p>
                    {doc.pages.map((page, i) => (
                      <Link
                        key={i}
                        href={`/docs/${page.route}`}
                        onClick={() => setIsOpen(false)}
                        className="text-white/50 ml-2">
                        {page.name}
                      </Link>
                    ))}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </section>
      </nav>
      <div className="flex flex-col px-5 items-center overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
