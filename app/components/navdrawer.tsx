import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { ReactNode } from "react";
import Button from "./button";
import Link from "next/link";

type Props = {
  children: ReactNode;
};

function NavDrawer({ children }: Props) {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-background/40" />
        <DrawerContent className="flex flex-col border-none rounded-none h-full w-72 fixed bottom-0 right-0 focus-visible:border-none focus-visible:outline-none">
          <div className="p4 flex flex-col gap-2 text-md">
            <Link href="/">Dashboard</Link>
            <Link href="/admin">Admin</Link>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline" className="border-white/50">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}

export default NavDrawer;
