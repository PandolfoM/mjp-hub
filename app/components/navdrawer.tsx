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
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  children: ReactNode;
};

export interface SimpleUser {
  _id: string;
  email: string;
  tempPassword: boolean;
  expireAt?: Date;
}

function NavDrawer({ children }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<SimpleUser | null>(null);

  useEffect(() => {
    const getMe = async () => {
      const me = await axios.get("/api/auth/me");
      setUser(me.data.user);
    };

    getMe();
  }, []);

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
        <DrawerContent className="flex flex-col border-none rounded-none h-full w-72 fixed bottom-0 right-0 focus-visible:border-none focus-visible:outline-none px-4 py-4 overflow-x-hidden">
          <section className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2 text-md">
              <Button variant="outline">
                <Link href="/">Dashboard</Link>
              </Button>
              <Button variant="outline">
                <Link href="/admin">Admin</Link>
              </Button>
            </div>
            <div className="overflow-hidden flex flex-col gap-2">
              {user && (
                <div className="flex items-center gap-2 overflow-hidden">
                  <FontAwesomeIcon icon={faCircleUser} className="w-7 h-auto" />{" "}
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
  );
}

export default NavDrawer;
