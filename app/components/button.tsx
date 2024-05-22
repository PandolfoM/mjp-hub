import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
};

function Button({ onClick, children, disabled, type, className }: Props) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`py-1 px-3 font-bold custom-border ${className}`}>
      {children}
    </button>
  );
}

export default Button;
