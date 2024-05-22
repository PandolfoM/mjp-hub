import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

function Button({ onClick, children, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="py-1 px-3 font-bold custom-border">
      {children}
    </button>
  );
}

export default Button;
