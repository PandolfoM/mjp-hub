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
    const outline = "font-bold border-2 rounded-sm";
    const customOutline =
      "font-bold custom-border disabled:opacity-50 transition-[opacity] duration-300 ease-in-out";
    const ghost = "underline hover:no-underline";
    const filled =
      "rounded-sm text-white/80 disabled:bg-opacity-30 disabled:opacity-60";

    return (
      <button
        ref={ref}
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
);

Button.displayName = "Button";

export default Button;
