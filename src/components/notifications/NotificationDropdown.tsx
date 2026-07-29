"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2, X } from "lucide-react";
import {
  isSafeInternalLink,
  type NotificationItem,
} from "@/services/notificationService";
import {
  useNotificationList,
  useUnreadNotifications,
} from "@/hooks/useNotifications";
import { notificationIcon, relativeTime } from "./notificationIcons";

interface LiveToast {
  key: number;
  item: NotificationItem;
}

/**
 * Navbar bell: unread badge (independent from the chat badge), dropdown with
 * the last 10 notifications, and live toasts for the B4 type list.
 * All titles/messages render as plain text — never HTML (Step B8).
 */
export default function NotificationDropdown({
  dashboardRole,
}: {
  dashboardRole: "student" | "mentor";
}) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<LiveToast | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onLiveNotification = useCallback(
    (item: NotificationItem, shouldToast: boolean) => {
      if (shouldToast) setToast({ key: Date.now(), item });
    },
    []
  );

  const unread = useUnreadNotifications(true, onLiveNotification);
  const { items, isLoading, markRead, markAllRead } = useNotificationList(
    "all",
    1,
    10,
    open
  );

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openNotification = async (item: NotificationItem) => {
    setOpen(false);
    if (!item.isRead) await markRead(item.id);
    // Defense-in-depth: only navigate to same-origin relative paths
    if (isSafeInternalLink(item.link)) {
      router.push(item.link);
    }
  };

  const notificationsHref = `/dashboard/${dashboardRole}/notifications`;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open notifications"
        className={`relative rounded-lg p-2 transition-colors ${
          open ? "bg-teal-50 text-teal-700" : "text-gray-500 hover:bg-gray-100 hover:text-teal-600"
        }`}
      >
        <Bell size={22} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/50">
            <p className="text-sm font-bold text-gray-900">Notifications</p>
            {unread > 0 && (
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                {unread} unread
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
              </div>
            ) : items.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-500">You&apos;re all caught up</p>
              </div>
            ) : (
              items.map((item) => {
                const Icon = notificationIcon(item.type);
                return (
                  <button
                    key={item.id}
                    onClick={() => void openNotification(item)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      item.isRead ? "" : "bg-teal-50/50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        item.isRead ? "bg-gray-100 text-gray-400" : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm truncate ${item.isRead ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
                        {item.title}
                      </span>
                      <span className="block text-xs text-gray-500 line-clamp-2">
                        {item.message}
                      </span>
                      <span className="block text-[11px] text-gray-400 mt-0.5">
                        {relativeTime(item.createdAt)}
                      </span>
                    </span>
                    {!item.isRead && (
                      <span className="mt-2 w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-50 bg-gray-50/50">
            <button
              onClick={() => void markAllRead()}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-teal-700 transition-colors"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
            <button
              onClick={() => {
                setOpen(false);
                router.push(notificationsHref);
              }}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors"
            >
              See all notifications
            </button>
          </div>
        </div>
      )}

      {/* Live toast for high-signal types (B4) */}
      {toast && (
        <div className="fixed top-20 right-6 z-[200] w-80 max-w-[calc(100vw-3rem)]">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3">
            {(() => {
              const Icon = notificationIcon(toast.item.type);
              return (
                <span className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </span>
              );
            })()}
            <button
              className="min-w-0 flex-1 text-left"
              onClick={() => {
                const { item } = toast;
                setToast(null);
                void openNotification(item);
              }}
            >
              <p className="text-sm font-bold text-gray-900 truncate">{toast.item.title}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{toast.item.message}</p>
            </button>
            <button
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
