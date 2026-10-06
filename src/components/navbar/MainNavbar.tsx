"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen, GraduationCap, Globe, Info, LogIn, UserPlus, LogOut, User, ChevronDown, FileText, Bookmark, Settings, Users, Inbox, MessageSquare, Star, Bell, LayoutDashboard, Package, Wallet, Home } from "lucide-react";
import { getToken, getUserInfo, removeToken, removeUserInfo, type UserInfo } from "@/lib/auth";
import { resolveFileUrl } from "@/lib/api";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import Avatar from "@/components/ui/Avatar";
import { useRouter } from "next/navigation";

function isUnder(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function getStoredUser(): UserInfo | null {
  const token = getToken();
  const userInfo = getUserInfo();

  return token && userInfo ? userInfo : null;
}

function subscribeToUserStore(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => { };

  window.addEventListener("storage", onStoreChange);
  window.addEventListener("focus", onStoreChange);
  window.addEventListener("agaaw-auth-change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("focus", onStoreChange);
    window.removeEventListener("agaaw-auth-change", onStoreChange);
  };
}

export default function MainNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const user = useSyncExternalStore(subscribeToUserStore, getStoredUser, () => null);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    removeToken();
    removeUserInfo();
    window.dispatchEvent(new Event("agaaw-auth-change"));
    setProfileDropdownOpen(false);
    router.push("/");
  };

  const dashboardRole = user?.role === "mentor" ? "mentor" : "student";
  const messagesHref = `/dashboard/${dashboardRole}/messages`;
  const messagesActive = pathname.startsWith(messagesHref);
  const unreadMessages = useUnreadMessages(Boolean(user && user.role !== "admin"));

  // Mentors browse students, not other mentors.
  const navLinks: { href: string; label: string; icon: typeof Home }[] = [
    { href: "/", label: "Home", icon: Home },
    ...(user?.role === "mentor"
      ? [{ href: "/students", label: "Students", icon: Users }]
      : [{ href: "/mentors", label: "Mentors", icon: Users }]),
    { href: "/scholarships", label: "Scholarships", icon: GraduationCap },
    { href: "/countries", label: "Countries", icon: Globe },
    { href: "/blogs", label: "Blogs", icon: BookOpen },
    { href: "/about-us", label: "About Us", icon: Info },
  ];

  const linkActive = (link: { href: string }) => (link.href === "/" ? pathname === "/" : isUnder(pathname, link.href));

  // Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close menu on route change
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setMenuOpen(false);
      setProfileDropdownOpen(false);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <header className="w-full border-b border-ink/10 bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/Agaaw_logo_noBG.png"
              alt="Agaaw Logo"
              width={50}
              height={50}
              className="object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-semibold text-codgray">Agaaw</span>
              <span className="text-sm text-bombay -mt-0.5">Fly to your Future</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} active={linkActive(link)} />
            ))}
          </nav>

          {/* Desktop Login & Register */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href={messagesHref}
                  aria-label="Open messages"
                  className={`relative rounded-lg p-2 transition-colors ${messagesActive ? "bg-teal-50 text-teal-700" : "text-gray-500 hover:bg-gray-100 hover:text-teal-600"
                    }`}
                >
                  <MessageSquare size={22} />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {unreadMessages > 99 ? "99+" : unreadMessages}
                    </span>
                  )}
                </Link>
                {user.role !== "admin" && (
                  <NotificationDropdown dashboardRole={dashboardRole} />
                )}

                <div className="h-6 w-px bg-gray-200 mx-1"></div>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border-2 border-teal-50 shadow-sm uppercase tracking-wide text-sm overflow-hidden">
                      <Avatar src={resolveFileUrl(user.profileImage)} name={user.firstName || "U"} />
                    </div>
                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-[11px] text-gray-500 truncate uppercase tracking-wider font-semibold">{user.role}</p>
                      </div>
                      {user.role === 'mentor' ? (
                        <>
                          <Link href='/dashboard/mentor' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors font-semibold">
                            <LayoutDashboard size={18} className="text-teal-600" /> Dashboard
                          </Link>
                          <Link href='/dashboard/mentor/profile' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <User size={18} className="text-gray-400 group-hover:text-teal-600" /> My Profile
                          </Link>
                          <Link href='/dashboard/mentor/students' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <Users size={18} className="text-gray-400 group-hover:text-teal-600" /> Your Students
                          </Link>
                          <Link href='/dashboard/mentor/requests' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <Inbox size={18} className="text-gray-400 group-hover:text-teal-600" /> Mentorship Requests
                          </Link>
                          <Link href='/dashboard/mentor/orders' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <Package size={18} className="text-gray-400 group-hover:text-teal-600" /> Orders
                          </Link>
                          <Link href='/dashboard/mentor/wallet' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <Wallet size={18} className="text-gray-400 group-hover:text-teal-600" /> Wallet
                          </Link>
                          <Link href='/dashboard/mentor/blogs' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <BookOpen size={18} className="text-gray-400 group-hover:text-teal-600" /> Blog & Resources
                          </Link>
                          <Link href='/dashboard/mentor/messages' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <MessageSquare size={18} className="text-gray-400 group-hover:text-teal-600" /> Messages
                          </Link>
                          <Link href='/dashboard/mentor/reviews' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <Star size={18} className="text-gray-400 group-hover:text-teal-600" /> Reviews
                          </Link>
                          <Link href='/dashboard/mentor/notifications' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <Bell size={18} className="text-gray-400 group-hover:text-teal-600" /> Notifications
                          </Link>
                          <Link href='/dashboard/mentor/settings' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <Settings size={18} className="text-gray-400 group-hover:text-teal-600" /> Settings
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href='/dashboard/student' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors font-semibold">
                            <LayoutDashboard size={18} className="text-teal-600" /> Dashboard
                          </Link>
                          <Link href='/dashboard/student/profile' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <User size={18} className="text-gray-400 group-hover:text-teal-600" /> My Profile
                          </Link>
                          <Link href='/dashboard/student/mentors' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <Users size={18} className="text-gray-400 group-hover:text-teal-600" /> Your Mentors
                          </Link>
                          <Link href='/dashboard/student/orders' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <Package size={18} className="text-gray-400 group-hover:text-teal-600" /> My Orders
                          </Link>
                          <Link href='/dashboard/student/documents' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <FileText size={18} className="text-gray-400 group-hover:text-teal-600" /> Documents
                          </Link>
                          <Link href='/dashboard/student/saved' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <Bookmark size={18} className="text-gray-400 group-hover:text-teal-600" /> Saved Scholarships
                          </Link>
                          <Link href='/dashboard/student/messages' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <MessageSquare size={18} className="text-gray-400 group-hover:text-teal-600" /> Messages
                          </Link>
                          <Link href='/dashboard/student/notifications' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <Bell size={18} className="text-gray-400 group-hover:text-teal-600" /> Notifications
                          </Link>
                          <Link href='/dashboard/student/settings' className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                            <Settings size={18} className="text-gray-400 group-hover:text-teal-600" /> Settings
                          </Link>
                        </>
                      )}
                      <div className="h-px bg-gray-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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
              {navLinks.map((link) => (
                <MobileNavLink key={link.href} href={link.href} label={link.label} icon={link.icon} active={linkActive(link)} />
              ))}
              {user ? (
                <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-teal-50/50 border border-teal-100/50">
                    <div className="relative w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center text-teal-800 font-bold border-2 border-white shadow-sm uppercase tracking-wide text-sm overflow-hidden">
                      <Avatar src={resolveFileUrl(user.profileImage)} name={user.firstName || "U"} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-teal-700 font-semibold uppercase tracking-tight">{user.role}</p>
                    </div>
                  </div>
                  {user.role === 'mentor' ? (
                    <>
                      <Link href='/dashboard/mentor' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-colors">
                        <LayoutDashboard size={18} className="text-teal-600" /> Dashboard
                      </Link>
                      <Link href='/dashboard/mentor/profile' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <User size={18} className="text-gray-400" /> My Profile
                      </Link>
                      <Link href='/dashboard/mentor/students' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Users size={18} className="text-gray-400" /> Your Students
                      </Link>
                      <Link href='/dashboard/mentor/requests' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Inbox size={18} className="text-gray-400" /> Mentorship Requests
                      </Link>
                      <Link href='/dashboard/mentor/orders' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Package size={18} className="text-gray-400" /> Orders
                      </Link>
                      <Link href='/dashboard/mentor/wallet' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Wallet size={18} className="text-gray-400" /> Wallet
                      </Link>
                      <Link href='/dashboard/mentor/blogs' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <BookOpen size={18} className="text-gray-400" /> Blog & Resources
                      </Link>
                      <Link href='/dashboard/mentor/messages' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <MessageSquare size={18} className="text-gray-400" /> Messages
                      </Link>
                      <Link href='/dashboard/mentor/reviews' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Star size={18} className="text-gray-400" /> Reviews
                      </Link>
                      <Link href='/dashboard/mentor/notifications' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Bell size={18} className="text-gray-400" /> Notifications
                      </Link>
                      <Link href='/dashboard/mentor/settings' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Settings size={18} className="text-gray-400" /> Settings
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href='/dashboard/student' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-colors">
                        <LayoutDashboard size={18} className="text-teal-600" /> Dashboard
                      </Link>
                      <Link href='/dashboard/student/profile' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <User size={18} className="text-gray-400" /> My Profile
                      </Link>
                      <Link href='/dashboard/student/mentors' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Users size={18} className="text-gray-400" /> Your Mentors
                      </Link>
                      <Link href='/dashboard/student/orders' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Package size={18} className="text-gray-400" /> My Orders
                      </Link>
                      <Link href='/dashboard/student/documents' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <FileText size={18} className="text-gray-400" /> Documents
                      </Link>
                      <Link href='/dashboard/student/saved' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Bookmark size={18} className="text-gray-400" /> Saved Scholarships
                      </Link>
                      <Link href='/dashboard/student/messages' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <MessageSquare size={18} className="text-gray-400" /> Messages
                      </Link>
                      <Link href='/dashboard/student/notifications' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Bell size={18} className="text-gray-400" /> Notifications
                      </Link>
                      <Link href='/dashboard/student/settings' className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Settings size={18} className="text-gray-400" /> Settings
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors mt-2 border border-red-100/50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
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
              )}
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

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "text-elm bg-elm/10" : "text-codgray hover:bg-gray-100"}`}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: typeof Home; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? "text-elm bg-elm/10" : "text-gray-700 hover:bg-gray-100"}`}
    >
      <Icon size={18} className={active ? "text-elm" : "text-gray-400"} />
      {label}
    </Link>
  );
}
