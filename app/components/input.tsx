import React from "react";

type Props = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
  type?: string;
};

function Input({ onChange, value, placeholder, type }: Props) {
  return (
    <input
      type={type}
      className="w-full bg-white/5 border-0 text-sm rounded-0 py-2 px-3 focus-visible:outline-none placeholder:text-white/50"
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
  );
}

export default Input;
