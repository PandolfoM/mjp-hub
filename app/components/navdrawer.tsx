import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { ReactNode } from "react";
import Link from "next/link";
import Button from "./button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  children: ReactNode;
};

function NavDrawer({ children }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.delete("/api/users/signout");
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-background/40" />
        <DrawerContent className="flex flex-col border-none rounded-none h-full w-72 fixed bottom-0 right-0 focus-visible:border-none focus-visible:outline-none px-4">
          <section className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2 text-md">
              <Link href="/">Dashboard</Link>
              <Link href="/admin">Admin</Link>
            </div>
            <div className="mb-5">
              <Button onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} /> Log out
              </Button>
            </div>
          </section>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}

export default NavDrawer;
