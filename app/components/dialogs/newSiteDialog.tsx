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
import React, { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import Button from "../button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSite } from "@/app/context/SiteContext";

type Props = {
  children: ReactNode;
};

function NewSiteDialog({ children }: Props) {
  const [title, setTitle] = useState<string>("");
  const { setLoading, loading } = useSite();
  const router = useRouter();

  const createSite = async () => {
    setLoading(true);
    try {
      const createSite = await axios.post("/api/sites/createsite", {
        title,
      });
      setLoading(false);
      router.push(`/manage/${createSite.data.id}`);
    } catch (e) {
      console.log(e);
      setLoading(false);
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
            placeholder="Title"
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <DialogFooter>
            <Button
              disabled={!title || loading}
              className="sm:w-20"
              onClick={createSite}>
              Create
            </Button>
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={loading}
                className="sm:w-20 border-white/50">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default NewSiteDialog;
