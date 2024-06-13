import React, { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "../button";
import { Site } from "@/models/Site";

type Props = {
  name: string;
  children: ReactNode;
  onClick: () => void;
};

function DeleteDialog({ name, children, onClick }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-background/40" />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Confirm</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col max-h-[30rem]">
            <p>Are you sure you want to delete {name}</p>
          </div>
          <DialogFooter>
            <section className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="w-20 border-white/50">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="filled"
                className="w-20 bg-error"
                onClick={onClick}>
                Confirm
              </Button>
            </section>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default DeleteDialog;
