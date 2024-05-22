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
      className="bg-transparent border-2 text-sm border-white rounded-0 py-1 px-3 focus-visible:outline-none placeholder:text-white/40"
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
  );
}

export default Input;
