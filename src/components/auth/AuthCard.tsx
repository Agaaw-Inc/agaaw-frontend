"use client";

import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export default function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div
      className={`
        w-full max-w-md bg-light
        border border-bombay/40 rounded-2xl shadow-sm 
        p-8
        ${className}
      `}
    >
      {children}
    </div>
  );
}
