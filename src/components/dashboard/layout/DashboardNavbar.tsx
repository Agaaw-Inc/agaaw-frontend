"use client";

import Image from "next/image";
import { HomeIcon, InfoIcon, University } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function DashboardNavbar() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full bg-light border-b border-bombay/30 px-6 py-3 flex items-center justify-between sticky top-0 z-50">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/agaaw_logo_01.png"
          alt="Agaaw Logo"
          width={34}
          height={34}
          className="object-contain"
        />

        <div>
          <p className="text-base font-semibold text-codgray">Agaaw</p>
          <p className="text-xs text-bombay -mt-1">Fly to your future</p>
        </div>
      </div>

      {/* Right: Scholarship + Country + Profile + Sign Out */}
      <div className="flex items-center gap-4">

        {/* Scholarship */}
        <Link
          href="/scholarships"
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-bombay/40 text-codgray hover:bg-bombay/10 transition"
        >
          <University className="h-4 w-4" />
          Scholarship
        </Link>

        {/* Country */}
        <Link
          href="/countries"
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-bombay/40 text-codgray hover:bg-bombay/10 transition"
        >
          <HomeIcon className="h-4 w-4" />
          Country
        </Link>

        {/* About */}
        <Link
          href="/about"
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-bombay/40 text-codgray hover:bg-bombay/10 transition"
        >
          <InfoIcon className="h-4 w-4" />
          About
        </Link>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="h-10 w-10 rounded-full bg-elm-light/20 flex items-center justify-center text-elm-dark font-semibold cursor-pointer hover:bg-elm-light/30 transition"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            FK
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-bombay/20 rounded-md shadow-lg py-1 z-50">
              <Link
                href="/dashboard/student/profile"
                className="block px-4 py-2 text-sm text-codgray hover:bg-slate-50 hover:text-elm-dark transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 text-sm text-codgray hover:bg-slate-50 hover:text-elm-dark transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
