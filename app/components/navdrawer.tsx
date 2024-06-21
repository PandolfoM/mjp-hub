import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import Link from "next/link";
import Button from "./button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  children: ReactNode;
};

interface User {
  _id: string;
  email: string;
  tempPassword: boolean;
}

function NavDrawer({ children }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

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
        <DrawerContent className="flex flex-col border-none rounded-none h-full w-72 fixed bottom-0 right-0 focus-visible:border-none focus-visible:outline-none px-4 overflow-x-hidden">
          <section className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2 text-md">
              <Button variant="outline">
                <Link href="/">Dashboard</Link>
              </Button>
              <Button variant="outline">
                <Link href="/admin">Admin</Link>
              </Button>
            </div>
            <div className="mb-5 overflow-hidden flex flex-col gap-2">
              {user && <p>{user.email}</p>}
              <Button onClick={handleLogout} className="min-w-fit">
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
