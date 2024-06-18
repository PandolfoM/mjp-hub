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
import React, { Dispatch, ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import Button from "../button";
import axios from "axios";
import { format } from "date-fns";

type Props = {
  site: Site;
  setSite: Dispatch<Site>;
  children: ReactNode;
};

function DeployDialog({ site, setSite, children }: Props) {
  const [deployMessage, setDeployMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deploySite = async (type: "live" | "test") => {
    setIsLoading(true);
    try {
      const deploySite = await axios.post("/api/sites/publishsite", {
        appId: site.appId,
        message: deployMessage,
        type,
        branchCreated: site.deployments.length > 0 ? true : false,
      });
      setDeployMessage("");
      setSite(deploySite.data.updatedSite);
      setIsLoading(false);
    } catch (error) {
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
            <DialogTitle className="text-lg">Deployments</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col max-h-[30rem]">
            <section className="flex-1 overflow-y-auto gap-1 flex flex-col">
              {site.deployments.length > 0 ? (
                <>
                  {site.deployments.map((deploy, i) => (
                    <div
                      key={i}
                      className="text-sm flex justify-between bg-card/[5%] p-2 rounded-sm">
                      <div>
                        <p>{deploy.title}</p>
                        <p>{deploy.type}</p>
                      </div>
                      <div>
                        <p>{format(deploy.date, "d/M/y hh:mm:ss a")}</p>
                      </div>
                    </div>
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
                value={deployMessage}
                placeholder="Message"
                onChange={(e: any) => setDeployMessage(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  disabled={!deployMessage || isLoading}
                  className="w-20"
                  onClick={() => {
                    deploySite("test");
                  }}>
                  Test
                </Button>
                <Button
                  disabled={!deployMessage || isLoading}
                  className="w-20"
                  onClick={() => {
                    deploySite("live");
                  }}>
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
