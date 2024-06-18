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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const createSite = async () => {
    setIsLoading(true);
    try {
      const createSite = await axios.post("/api/sites/createsite", {
        title,
      });
      setIsLoading(false);
      router.push(`/manage/${createSite.data.id}`);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
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
            <Button
              disabled={!title || isLoading}
              className="w-20"
              onClick={createSite}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default NewSiteDialog;
