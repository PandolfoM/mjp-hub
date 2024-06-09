import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
  variant?: "ghost" | "outline" | "cancel" | "success";
};

function Button({
  onClick,
  children,
  disabled,
  type,
  className,
  variant,
}: Props) {
  if (!variant) {
    variant = "outline";
  }

  const outline = "py-1 px-3 font-bold custom-border";
  const ghost = "underline hover:no-underline";
  const cancel = "border-2 border-cancel py-1 px-3 rounded-sm"
  const success = "border-2 border-success py-1 px-3 rounded-sm"

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${variant === "ghost" ? ghost : variant === "cancel" ? cancel : variant === "success" ? success : outline} ${className}`}>
      {children}
    </button>
  );
}

export default Button;
