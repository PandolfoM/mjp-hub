import React, { ReactElement } from "react";

type Props = {
  children: ReactElement;
  className?: string;
};

function VerticalCard({ children, className }: Props) {
  return (
    <div className={`h-[300px] w-[250px] min-w-[250px] min-h-[300px] flex flex-col items-start justify-start gap-[15px] bg-gradient-radial to-80% from-card/[10%] to-card/[2%] rounded-[10px] p-2 ${className}`}>
      {children}
    </div>
  );
}

export default VerticalCard;