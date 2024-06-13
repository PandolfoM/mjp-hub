import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import Button from "../button";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  children: ReactNode;
};

function NewSiteDialog({ children }: Props) {
  const [title, setTitle] = useState<string>("");
  const router = useRouter();

  const createSite = async () => {
    try {
      const createSite = await axios.post("/api/sites/createsite", {
        title,
      });
      router.push(`/manage/${createSite.data.id}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-background/40" />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Create Site</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Message"
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <DialogFooter>
            <Button disabled={!title} className="w-20" onClick={createSite}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default NewSiteDialog;
