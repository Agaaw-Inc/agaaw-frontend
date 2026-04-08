"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen, GraduationCap, Globe, Info, LogIn } from "lucide-react";

const NAV_LINKS = [
  { href: "/scholarships", label: "Scholarships", icon: GraduationCap },
  { href: "/countries",    label: "Countries",    icon: Globe },
  { href: "/blogs",        label: "Blogs",        icon: BookOpen },
  { href: "/about",        label: "About",        icon: Info },
];

export default function MainNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header className="w-full border-b border-bombay/20 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/agaaw_logo_01.png"
            alt="Agaaw Logo"
            width={38}
            height={38}
            className="object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-semibold text-codgray">Agaaw</span>
            <span className="text-sm text-bombay -mt-0.5">Fly to your Future</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-teal-700 bg-teal-50"
                    : "text-codgray hover:bg-gray-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Login */}
        <div className="hidden md:block">
          <Link
            href="/login"
            className="rounded-xl bg-teal-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden border-t border-gray-100 bg-white shadow-lg"
        >
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "text-teal-700 bg-teal-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-teal-600" : "text-gray-400"} />
                  {label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-gray-100">
              <Link
                href="/login"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
              >
                <LogIn size={18} className="text-teal-600" />
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
