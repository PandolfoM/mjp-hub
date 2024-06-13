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
import { Site } from "@/models/Site";
import React, { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import Button from "../button";

type Props = {
  site: Site;
  children: ReactNode;
};

function DeployDialog({ site, children }: Props) {
  const [error, setError] = useState<string>("");
  const [deployMessage, setDeployMessage] = useState<string>("");

  const deploySite = () => {};

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-background/40" />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Deployments</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col max-h-[30rem]">
            <section className="flex-1 overflow-y-auto">
              {site.deployments.length > 0 ? (
                <>
                  {site.deployments.map((deploy, i) => (
                    <div key={i}>{deploy.title}</div>
                  ))}
                </>
              ) : (
                <>
                  <p className="text-white/50 w-full text-center py-2">
                    No deployments
                  </p>
                </>
              )}
            </section>
          </div>
          <DialogFooter>
            <section className="flex flex-col gap-2">
              <Input
                placeholder="Message"
                onChange={(e: any) => setDeployMessage(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  disabled={!deployMessage}
                  className="w-20"
                  onClick={deploySite}>
                  Test
                </Button>
                <Button
                  disabled={!deployMessage}
                  className="w-20"
                  onClick={deploySite}>
                  Live
                </Button>
              </div>
            </section>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default DeployDialog;
