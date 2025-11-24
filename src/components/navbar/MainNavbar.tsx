"use client";

import Link from "next/link";
import Image from "next/image";

export default function MainNavbar() {
  return (
    <header className="w-full border-b border-bombay/20 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo + Title */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/agaaw_logo_01.png"    
            alt="Agaaw Logo"
            width={38}
            height={38}
            className="object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-semibold text-codgray">Agaaw</span>
            <span className="text-sm text-bombay -mt-0.5">
              Fly to your Future
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-5">

          <Link
            href="/login"
            className="rounded-md bg-elm px-4 py-1 text-sm font-medium text-white shadow-sm hover:bg-elm-dark transition"
          >
            Login
          </Link>

        </div>

      </div>
    </header>
  );
}
