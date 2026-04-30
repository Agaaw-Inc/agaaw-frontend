// components/ui/Button.tsx
"use client";

import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        px-6 py-3 rounded-lg
        bg-gray-900 text-white text-base font-bold
        hover:bg-[#20B2AA] active:scale-[0.98]
        transition-all disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}
