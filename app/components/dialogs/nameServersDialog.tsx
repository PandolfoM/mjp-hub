import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "../button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { copyToClipboard } from "@/utils/copyToClipboard";
import Popout from "../popout";

type Props = {
  open: boolean;
  nameServers: string[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

function NameServersDialog({ open, nameServers, setIsOpen }: Props) {
  return (
    <Dialog open={open}>
      <DialogPortal>
        <DialogOverlay className="bg-background/40" />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Warning!</DialogTitle>
            <DialogDescription>
              Copy the nameservers and add them into{" "}
              <a
                href="https://dcc.godaddy.com/control/portfolio"
                target="_blank"
                className="underline hover:no-underline">
                GoDaddy
              </a>
              ! This is the only time you will see the name servers!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col max-h-[30rem] gap-[5px]">
            {nameServers.map((server, i) => (
              <div className="flex items-center gap-5" key={i}>
                <p>{server}</p>
                <Popout text="Copy">
                  <div className="border rounded-sm border-primary w-8 h-8 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCopy} />
                  </div>
                </Popout>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="filled"
              className="bg-primary"
              onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default NameServersDialog;
