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
          w-full px-4 py-3 rounded-lg
          bg-white border border-gray-300
          text-gray-900 placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-[#20B2AA]/20 focus:border-[#20B2AA]
          transition-all disabled:cursor-not-allowed disabled:opacity-60
          ${className}
        `}
      />
    );
  }
);
Input.displayName = "Input";

export default Input;
