"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export default function AuthCard({ children, className = "" }: AuthCardProps) {
  const pathname = usePathname();

  let heading = "Fly to your future\nwith Agaaw";

  // Custom text for registration pages if the user still wants them, 
  // but the image shows a very clean "Fly to your future" look.
  // I will stick to the "Fly to your future" for the left side as per the image for ALL pages
  // to maintain consistency with the provided design.

  return (
    <div
      className={`
        w-full min-h-screen bg-white
        flex flex-col md:flex-row
        ${className}
      `}
    >
      {/* Left Side - Image with Text Overlay */}
      <div className="hidden md:flex w-[45%] bg-codgray text-white flex-col relative overflow-hidden h-screen">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/auth-agaaw.png"
            alt="Authentication Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Text Overlay - Top Left as per image */}
        <div className="relative z-10 p-16 lg:p-24 flex flex-col h-full">
          <div className="drop-shadow-lg">
            <h1 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight mb-2 whitespace-nowrap">
              Fly to your future
            </h1>
            <p className="text-2xl lg:text-3xl font-medium opacity-90">
              with Agaaw
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-[55%] h-screen flex flex-col justify-center items-center bg-white overflow-y-auto">
        <div className="w-full max-w-md p-6 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
