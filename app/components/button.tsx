import { cn } from "@/lib/utils";
import React, { ReactNode, forwardRef } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "submit" | "reset" | "button";
  variant?: "ghost" | "outline" | "filled";
};

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    { onClick, children, disabled, type = "button", className = "", variant },
    ref
  ) => {
    const outline = "font-bold border-2 rounded-sm border-primary";
    const customOutline =
      "font-bold custom-border disabled:opacity-50 transition-[opacity] duration-300 ease-in-out py-1.5";
    const ghost =
      "underline hover:no-underline disabled:text-white/50 disabled:hover:underline";
    const filled =
      "rounded-sm text-white/80 disabled:bg-opacity-30 disabled:opacity-60 bg-primary";

    return (
      <button
        ref={ref}
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={cn(
          `py-1 px-3 ${
            variant === "ghost"
              ? ghost
              : variant === "filled"
              ? filled
              : variant === "outline"
              ? outline
              : customOutline
          } ${className}`
        )}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
