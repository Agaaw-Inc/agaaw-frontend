"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, GraduationCap, Globe, BookOpen, Info, LogOut, User, Bell, MessageCircle } from "lucide-react";

import { MOCK_MESSAGES } from "@/data/messages";
import { MOCK_NOTIFICATIONS } from "@/data/notifications";
import MessagesPopover from "./popovers/MessagesPopover";
import NotificationsPopover from "./popovers/NotificationsPopover";
import ProfilePopover from "./popovers/ProfilePopover";

const NAV_LINKS = [
  { href: "/scholarships", label: "Scholarship", icon: GraduationCap },
  { href: "/countries",    label: "Country",     icon: Globe },
  { href: "/blogs",        label: "Blogs",       icon: BookOpen },
  { href: "/about",        label: "About",       icon: Info },
];

export default function DashboardNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const unreadMessagesCount = MOCK_MESSAGES.filter(m => m.unread).length;
  const unreadNotificationsCount = MOCK_NOTIFICATIONS.filter(n => n.unread).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (messagesRef.current && !messagesRef.current.contains(e.target as Node)) setMessagesOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { 
    setMenuOpen(false); 
    setProfileOpen(false); 
    setMessagesOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setMessagesOpen(false);
    setNotificationsOpen(false);
  };

  const toggleMessages = () => {
    setMessagesOpen(!messagesOpen);
    setProfileOpen(false);
    setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
    setMessagesOpen(false);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/agaaw_logo_01.png" alt="Agaaw Logo" width={34} height={34} className="object-contain" />
          <div>
            <p className="text-base font-semibold text-codgray leading-tight">Agaaw</p>
            <p className="text-xs text-bombay -mt-0.5">Fly to your future</p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "text-teal-700 bg-teal-50" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Desktop: Right Actions */}
        <div className="hidden md:flex items-center gap-2">
          
          {/* Messenger Dropdown */}
          <div className="relative" ref={messagesRef}>
            <button
              onClick={toggleMessages}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors relative ${messagesOpen ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              <MessageCircle size={20} fill={messagesOpen ? "currentColor" : "none"} />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
            {messagesOpen && <MessagesPopover />}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={toggleNotifications}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors relative ${notificationsOpen ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              <Bell size={20} fill={notificationsOpen ? "currentColor" : "none"} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            {notificationsOpen && <NotificationsPopover />}
          </div>

          {/* Profile Dropdown */}
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={toggleProfile}
              className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm transition ${profileOpen ? 'bg-teal-200 text-teal-800' : 'bg-teal-100 text-teal-700 hover:bg-teal-200'}`}
            >
              FK
            </button>
            {profileOpen && <ProfilePopover onClose={() => setProfileOpen(false)} />}
          </div>
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

      {/* Mobile menu */}
      {menuOpen && (
        <div ref={menuRef} className="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? "text-teal-700 bg-teal-50" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-teal-600" : "text-gray-400"} />
                  {label}
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-gray-100 space-y-1">
              <Link href="#" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <MessageCircle size={18} className="text-gray-400" /> Messages
                </div>
                {unreadMessagesCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadMessagesCount}</span>}
              </Link>
              <Link href="#" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-gray-400" /> Notifications
                </div>
                {unreadNotificationsCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadNotificationsCount}</span>}
              </Link>
              <Link href="/dashboard/student/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setMenuOpen(false)}>
                <User size={18} className="text-gray-400" /> Profile
              </Link>
              <button onClick={() => { setMenuOpen(false); router.push("/"); }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
