"use client";

import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`
        w-full px-3 py-1.5 rounded-md
        bg-bombay/20 border-[0.5px] border-bombay/40
        text-codgray placeholder:text-bombay
        focus:outline-none focus:ring-1 focus:ring-codgray focus:border-elm
        transition disabled:cursor-not-allowed disabled:opacity-60
        ${className}
      `}

    />
  );
}
