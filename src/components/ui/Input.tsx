"use client";

import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
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
);
Input.displayName = "Input";

export default Input;
