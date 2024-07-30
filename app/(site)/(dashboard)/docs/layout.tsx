"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import NavDrawer from "@/app/components/navdrawer";
import { useSite } from "@/app/context/SiteContext";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import axios from "axios";
import { Doc, PagesI } from "@/models/Doc";
import { useUser } from "@/app/context/UserContext";
import Button from "@/app/components/button";
import NewDocDialog from "@/app/components/dialogs/newDocDialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Permissions } from "@/utils/permissions";
import { useRouter } from "next/navigation";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setLoading } = useSite();
  const { hasPermission } = useUser();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const getDocs = async () => {
      try {
        const res = await axios.get("/api/docs/getdocs");
        const { docs, categories } = res.data.data;
        setDocs(docs);
        setCategories(categories);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    getDocs();
  }, [setLoading]);

  return (
    <div className="flex flex-col h-full w-full gap-5 overflow-hidden md:flex-row md:gap-0">
      <nav className="flex flex-col justify-between items-center relative z-10 md:hidden">
        <div className="flex justify-between h-8 items-center px-2 py-6 w-full border-b border-white/50 sm:hidden">
          <NavDrawer>
            <FontAwesomeIcon
              className="cursor-pointer md:hidden w-5 h-auto"
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
              exit={{ y: "99%", opacity: 0 }}
              className={
                "px-2 pb-28 absolute bottom-0 translate-y-full gap-2 border-b border-white/30 bg-background w-full overflow-y-auto h-dvh"
              }>
              <DocsList
                setCategories={setCategories}
                onClick={() => setIsOpen(!isOpen)}
                docs={docs}
                setDocs={setDocs}
              />
            </motion.div>
          )}
        </section>
      </nav>

      {/* Desktop */}
      <div className="hidden md:block w-0.5 h-full bg-primary" />
      <div className="hidden md:flex md:flex-col justify-between w-60 h-full bg-card/5 p-2">
        <DocsList setCategories={setCategories} docs={docs} setDocs={setDocs} />
        <NewDocDialog setDocs={setDocs} categories={categories}>
          {!hasPermission(Permissions.User) && <Button>Add New Doc</Button>}
        </NewDocDialog>
      </div>
      <div className="flex px-5 items-center overflow-y-auto h-full w-full md:p-5">
        {children}
      </div>
    </div>
  );
}

const DocsList = ({
  onClick,
  docs,
  setDocs,
  setCategories,
}: {
  onClick?: () => void;
  docs: Doc[];
  setDocs: Dispatch<SetStateAction<Doc[]>>;
  setCategories: Dispatch<SetStateAction<{ label: string; value: string }[]>>;
}) => {
  const { hasPermission } = useUser();
  const router = useRouter();

  const deleteDoc = async (page: PagesI) => {
    try {
      const res = await axios.post("/api/docs/deletedoc", {
        page,
      });

      if (res.data.data.deletedCategory) {
        setCategories((prevCategories) =>
          prevCategories.filter(
            (category) =>
              category.value !== res.data.data.deletedCategory.categoryRoute
          )
        );
      }

      router.push("/docs");
      setDocs(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ul className="flex flex-col gap-2 w-full overflow-y-auto h-full">
      <li className="flex flex-col gap-2">
        <p className="text-white cursor-default">Get Started</p>
        <Link
          href={`/docs`}
          onClick={onClick}
          className="text-white/50 ml-2 no-underline">
          Welcome
        </Link>
      </li>
      {docs.map((doc, i) => (
        <li key={i} className="flex flex-col gap-2">
          <p className="text-white cursor-default">{doc.category}</p>
          {doc.pages.map((page, i) => (
            <ContextMenu key={i}>
              <ContextMenuTrigger disabled={hasPermission(Permissions.User)}>
                <Link
                  href={`/docs/${doc.categoryRoute}/${page.route}`}
                  onClick={onClick}
                  className="text-white/50 ml-2 no-underline">
                  {page.name}
                </Link>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() => deleteDoc(page)}
                  className="cursor-pointer">
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </li>
      ))}
    </ul>
  );
};
