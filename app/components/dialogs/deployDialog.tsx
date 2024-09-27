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
import { DeploymentsI, Site } from "@/models/Site";
import React, { Dispatch, ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import Button from "../button";
import axios from "axios";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/app/context/UserContext";
import { useSite } from "@/app/context/SiteContext";
import ContentSpinner from "../contentSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

type Props = {
  site: Site;
  setSite: Dispatch<Site>;
  children: ReactNode;
};

function DeployDialog({ site, setSite, children }: Props) {
  const { user } = useUser();
  const { loading, setLoading } = useSite();
  const [deployMessage, setDeployMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [contentLoading, setContentLoading] = useState<boolean>(false);
  const [deployments, setDeployments] = useState<DeploymentsI[]>([]);

  const deploySite = async (type: "live" | "test") => {
    setLoading(true);
    try {
      const appId = type === "test" ? site.testAppId : site.appId;
      const deploySite = await axios.post("/api/sites/publishsite", {
        appId,
        message: deployMessage,
        type,
        user,
      });

      setDeployMessage("");
      setError("");
      setSite(deploySite.data.updatedSite);
      setLoading(false);
    } catch (error: any) {
      const err: string = error.response.data.error;
      setError(
        err.includes("already have pending or running jobs")
          ? "Job already running"
          : err
      );
      setLoading(false);
    }
  };

  const getDeployments = async (open: boolean) => {
    if (!open) return setDeployments([]);

    setContentLoading(true);
    if (!site) return;
    try {
      const res = await axios.post<{ deployments: DeploymentsI[] }>(
        "/api/sites/getdeployments",
        {
          siteId: site._id,
          appId: site.appId,
          testAppId: site.testAppId,
        }
      );
      const deployments = res.data.deployments;

      setDeployments(deployments);

      // // @ts-ignore
      // setSite((prevSite: Site) => ({
      //   ...prevSite!,
      //   deployments: deployments,
      // }));
      setContentLoading(false);
    } catch (error) {
      console.log(error);
      setError("There has been an error");
      setContentLoading(false);
    }
  };

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          getDeployments(open);
        }}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogPortal>
          <DialogOverlay className="bg-background/40" />
          <DialogContent>
            <DialogHeader className="flex flex-row justify-between">
              <DialogTitle className="text-lg">Deployments</DialogTitle>
              <Button
                variant="ghost"
                className="gap-1 flex items-center group"
                onClick={() => getDeployments(true)}>
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  className="group-hover:rotate-180 transition-all duration-300 ease-in-out"
                />
                Refresh
              </Button>
            </DialogHeader>
            <div className="flex flex-col max-h-[30rem] overflow-hidden">
              {contentLoading ? (
                <ContentSpinner />
              ) : (
                <>
                  <section className="flex-1 overflow-y-auto gap-1 flex flex-col md:hidden">
                    {deployments.length > 0 ? (
                      <>
                        {deployments
                          .sort(
                            (a, b) =>
                              new Date(b.startTime).getTime() -
                              new Date(a.startTime).getTime()
                          )
                          .map((deploy, i) => (
                            <div
                              key={i}
                              className={`text-sm flex justify-between bg-card/5 p-2 rounded-sm gap-2 text-nowrap ${
                                deploy.status === "pending" ||
                                deploy.status === "running"
                                  ? "bg-warning/10"
                                  : deploy.status === "failed"
                                  ? "bg-error/10"
                                  : "bg-success/10"
                              }`}>
                              <div className="w-1/2 overflow-hidden">
                                <p className="text-ellipsis overflow-hidden">
                                  {deploy.title}
                                </p>
                                <p className="text-ellipsis overflow-hidden">
                                  Type: {deploy.type}
                                </p>
                                <p className="capitalize text-ellipsis overflow-hidden">
                                  {deploy.status === "succeed"
                                    ? "Completed"
                                    : deploy.status}
                                </p>
                                <p className="text-ellipsis overflow-hidden">
                                  {deploy.deployedBy}
                                </p>
                              </div>
                              <div className="text-right w-1/2 overflow-hidden">
                                <div>
                                  <p>
                                    Started:{" "}
                                    {format(deploy.startTime, "M/d/y hh:mm a")}
                                  </p>
                                  {deploy.endTime && (
                                    <p>
                                      Finished:{" "}
                                      {format(deploy.endTime, "M/d/y hh:mm a")}
                                    </p>
                                  )}
                                </div>
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
                  <section className="flex-1 overflow-y-auto gap-1 hidden flex-col md:flex">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Deployed By</TableHead>
                          <TableHead>Started At</TableHead>
                          <TableHead>Finished At</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deployments
                          .sort(
                            (a, b) =>
                              new Date(b.startTime).getTime() -
                              new Date(a.startTime).getTime()
                          )
                          .map((deploy, i) => (
                            <TableRow
                              key={i}
                              className={`${
                                deploy.status === "pending" ||
                                deploy.status === "running"
                                  ? "bg-warning/10"
                                  : deploy.status === "failed"
                                  ? "bg-error/10"
                                  : "bg-success/10"
                              }`}>
                              <TableCell>{deploy.title}</TableCell>
                              <TableCell className="capitalize">
                                {deploy.type}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {deploy.deployedBy}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {format(deploy.startTime, "M/d/y hh:mm a")}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {deploy.endTime
                                  ? format(deploy.endTime, "M/d/y hh:mm a")
                                  : ""}
                              </TableCell>
                              <TableCell className="capitalize">
                                {deploy.status === "succeed"
                                  ? "Completed"
                                  : deploy.status}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </section>
                </>
              )}
            </div>
            <DialogFooter>
              <section className="flex flex-col gap-2 w-full">
                <Input
                  value={deployMessage}
                  placeholder="Message"
                  onChange={(e: any) => setDeployMessage(e.target.value)}
                />
                {error && <p className="text-sm text-error">{error}</p>}
                <div className="flex gap-2 justify-between">
                  <div className="flex gap-2">
                    <Button
                      disabled={!deployMessage || loading || contentLoading}
                      className="w-20"
                      onClick={() => {
                        deploySite("test");
                      }}>
                      Test
                    </Button>
                    <Button
                      disabled={
                        !deployMessage ||
                        loading ||
                        !site.liveURL ||
                        contentLoading
                      }
                      className="w-20"
                      onClick={() => {
                        deploySite("live");
                      }}>
                      Live
                    </Button>
                  </div>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      disabled={loading}
                      className="w-20 border-white/50">
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </section>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}

export default DeployDialog;
