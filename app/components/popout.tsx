import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  text: string;
};

function Popout({ children, text }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger className="flex justify-center" asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side="right">{text}</TooltipContent>
    </Tooltip>
  );
}

export default Popout;
