// components/ui/Card.tsx
"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        w-full max-w-md
        bg-white/20
        backdrop-blur-md
        border border-white/20 
        rounded-2xl
        shadow-[0_4px_28px_rgba(0,0,0,0.08)]
        p-8
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
