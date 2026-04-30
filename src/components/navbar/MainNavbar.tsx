"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen, GraduationCap, Globe, Info, LogIn, UserPlus } from "lucide-react";

const NAV_LINKS = [
  { href: "/scholarships", label: "Scholarships", icon: GraduationCap },
  { href: "/countries", label: "Countries", icon: Globe },
  { href: "/blogs", label: "Blogs", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
];

export default function MainNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
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
    <>
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? "text-teal-700 bg-teal-50"
                      : "text-codgray hover:bg-gray-100"
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Login & Register */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-5 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50 transition border border-transparent hover:border-teal-100"
            >
              Login
            </Link>
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="rounded-xl bg-teal-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 transition"
            >
              Register
            </button>
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                        ? "text-teal-700 bg-teal-50"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <Icon size={18} className={isActive ? "text-teal-600" : "text-gray-400"} />
                    {label}
                  </Link>
                );
              })}
              <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  <LogIn size={18} className="text-teal-600" />
                  Login
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setRegisterModalOpen(true);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors"
                >
                  <UserPlus size={18} className="text-white" />
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Register Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setRegisterModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-codgray mb-2">Join Agaaw</h2>
              <p className="text-bombay">Choose how you want to use our platform</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Student Card */}
              <Link
                href="/register/student"
                onClick={() => setRegisterModalOpen(false)}
                className="group flex flex-col items-center text-center p-8 rounded-2xl border-2 border-gray-100 hover:border-elm bg-gray-50 hover:bg-elm/5 transition-all"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-elm mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap size={32} />
                </div>
                <h3 className="text-xl font-semibold text-codgray mb-2">I am a Student</h3>
                <p className="text-sm text-gray-500">
                  Find the right mentor and scholarships to accelerate your learning journey.
                </p>
              </Link>

              {/* Mentor Card */}
              <Link
                href="/register/mentor"
                onClick={() => setRegisterModalOpen(false)}
                className="group flex flex-col items-center text-center p-8 rounded-2xl border-2 border-gray-100 hover:border-elm bg-gray-50 hover:bg-elm/5 transition-all"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-elm mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-xl font-semibold text-codgray mb-2">I am a Mentor</h3>
                <p className="text-sm text-gray-500">
                  Share your expertise, guide students, and grow your professional network.
                </p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
