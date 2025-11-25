"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardNavbar() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

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

      {/* Right: Profile + Sign Out */}
      <div className="flex items-center gap-4">

        {/* Profile Bubble */}
        <div className="h-10 w-10 rounded-full bg-elm-light/20 flex items-center justify-center text-elm-dark font-semibold cursor-pointer hover:bg-elm-light/30 transition">
          FK
        </div>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm 
                     border border-bombay/40 text-codgray 
                     hover:bg-bombay/10 transition"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
