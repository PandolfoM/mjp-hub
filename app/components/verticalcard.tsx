import React, { ReactElement } from "react";

type Props = {
  children: ReactElement;
  className?: string;
};

function VerticalCard({ children, className }: Props) {
  return (
    <div
      className={`h-[350px] min-h-[350px] w-[300px] min-w-[300px] flex flex-col items-start justify-start gap-[15px] bg-gradient-radial to-80% from-card/[10%] to-card/[2%] rounded-sm p-2 ${className}`}>
      {children}
    </div>
  );
}

export default VerticalCard;
