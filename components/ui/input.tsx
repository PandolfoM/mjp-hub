import * as React from "react";

import { cn } from "@/lib/utils";
import { jetBrains } from "@/app/fonts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye as EyeReg } from "@fortawesome/free-regular-svg-icons";
import { faEye as EyeSolid } from "@fortawesome/free-solid-svg-icons";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    return (
      <span
        className={cn(
          type === "password" && "flex items-center overflow-hidden relative"
        )}>
        <input
          type={showPassword ? "text" : type}
          className={cn(
            "flex h-10 w-full rounded-sm bg-white/5 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            type === "password" && "flex-1 w-full",
            jetBrains.className,
            className
          )}
          ref={ref}
          {...props}
        />
        {(type === "password" || showPassword) && (
          <FontAwesomeIcon
            icon={showPassword ? EyeSolid : EyeReg}
            onClick={() => setShowPassword(!showPassword)}
            className="px-3 absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer z-50"
          />
        )}
      </span>
    );
  }
);
Input.displayName = "Input";

export { Input };
