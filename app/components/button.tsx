import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
  variant?: "ghost" | "outline" | "filled";
};

function Button({
  onClick,
  children,
  disabled,
  type,
  className,
  variant,
}: Props) {
  const outline = "font-bold border-2 rounded-sm";
  const customOutline = "font-bold custom-border";
  const ghost = "underline hover:no-underline";
  const filled = "bg-primary rounded-sm";

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`py-1 px-3 ${
        variant === "ghost"
          ? ghost
          : variant === "filled"
          ? filled
          : variant === "outline"
          ? outline
          : customOutline
      } ${className}`}>
      {children}
    </button>
  );
}

export default Button;
