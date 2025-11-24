// components/ui/Button.tsx
"use client";

import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button({
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        px-4 py-2 rounded-lg
        bg-codgray text-light text-sm font-medium
        hover:bg-elm-dark active:bg-elm-dark/80
        transition disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}
