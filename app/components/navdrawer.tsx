import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Button from "./button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faGauge,
  faHammer,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/navigation";
import Popout from "./popout";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Site } from "@/models/Site";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "../context/UserContext";

type Props = {
  children?: ReactNode;
};

export interface SimpleUser {
  _id: string;
  email: string;
  name: string;
  tempPassword: boolean;
  expireAt?: Date;
  favorites: Site[];
}

function NavDrawer({ children }: Props) {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.delete("/api/users/signout");
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRedirect = (route: string) => {
    router.push(`/${route}`);
  };

  return (
    <>
      {children ? (
        <Drawer direction="left">
          <DrawerTrigger asChild className="sm:hidden">
            {children}
          </DrawerTrigger>
          <DrawerPortal>
            <DrawerOverlay className="fixed inset-0 bg-background/40" />
            <DrawerContent className="flex flex-col border-none rounded-none h-full w-72 fixed bottom-0 right-0 focus-visible:border-none focus-visible:outline-none px-4 py-4 overflow-x-hidden">
              <section className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2 text-md">
                  <Button variant="outline" onClick={() => handleRedirect("")}>
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRedirect("admin")}>
                    Admin
                  </Button>
                </div>
                <div className="overflow-hidden flex flex-col gap-2">
                  {user && (
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FontAwesomeIcon
                        icon={faCircleUser}
                        className="w-7 h-auto"
                      />{" "}
                      <p className="whitespace-nowrap text-ellipsis overflow-hidden">
                        {user.email}
                      </p>
                    </div>
                  )}
                  <Button onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} /> Log out
                  </Button>
                </div>
              </section>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      ) : (
        <aside className="hidden sm:flex bg-card/5 h-full w-16 p-2 flex-col items-center justify-between">
          <div className="flex flex-col w-full gap-5 text-md items-center">
            <Popout text="Dashboard">
              <div onClick={() => handleRedirect("")}>
                <FontAwesomeIcon
                  icon={faGauge}
                  className="w-1/2 h-auto cursor-pointer"
                />
              </div>
            </Popout>
            <Popout text="Admin">
              <div onClick={() => handleRedirect("admin")}>
                <FontAwesomeIcon
                  icon={faHammer}
                  className="w-1/2 h-auto cursor-pointer"
                />
              </div>
            </Popout>
          </div>
          <div className="overflow-hidden flex flex-col gap-2 w-full items-center">
            <HoverCard openDelay={0}>
              <HoverCardTrigger>
                {user ? (
                  <Avatar className="bg-primary cursor-pointer w-9 h-auto aspect-square">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Skeleton className="rounded-full w-9 h-auto aspect-square" />
                )}
              </HoverCardTrigger>
              <HoverCardContent side="right" align="end" sideOffset={20}>
                <div className="flex flex-col w-full gap-5 text-md items-start">
                  {user && (
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Avatar className="bg-primary cursor-pointer w-7 h-7 text-sm">
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="whitespace-nowrap text-ellipsis overflow-hidden">
                        {user.email}
                      </p>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    className="no-underline py-0 px-0"
                    onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} /> Log out
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </aside>
      )}
    </>
  );
}

const getInitials = (name: string) => {
  const words = name.split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  } else if (words.length >= 2) {
    return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  }
  return "";
};

export default NavDrawer;
