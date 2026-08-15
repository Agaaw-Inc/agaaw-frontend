"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, ChevronLeft, ChevronRight, Loader2, SlidersHorizontal } from "lucide-react";
import Footer from "@/components/landing/Footer";
import { useNotificationList } from "@/hooks/useNotifications";
import {
  getNotificationPreferences,
  isSafeInternalLink,
  updateNotificationPreferences,
  type NotificationItem,
  type NotificationPreference,
} from "@/services/notificationService";
import { notificationIcon, relativeTime } from "./notificationIcons";

const PAGE_SIZE = 20;

const CATEGORY_LABELS: Record<NotificationPreference["category"], string> = {
  content_matches: "Content matches",
  platform_news: "Platform news",
  mentorship: "Mentorship",
  sessions: "Sessions",
  messages: "Messages",
  reminders: "Reminders",
};

// Transactional categories — in-app toggle rendered disabled-on (Step B5)
const LOCKED_IN_APP = new Set(["mentorship", "sessions"]);

export default function NotificationsPage({
  dashboardRole,
}: {
  dashboardRole: "student" | "mentor";
}) {
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);
  const [showPreferences, setShowPreferences] = useState(false);
  const router = useRouter();

  const { items, total, isLoading, markRead, markAllRead } = useNotificationList(
    tab,
    page,
    PAGE_SIZE
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const openNotification = async (item: NotificationItem) => {
    if (!item.isRead) await markRead(item.id);
    if (isSafeInternalLink(item.link)) router.push(item.link);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Bell size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h1>
              <p className="text-sm text-gray-500">Everything that needs your attention</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => void markAllRead()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:border-teal-300 hover:text-teal-700 transition-colors"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
            <button
              onClick={() => setShowPreferences((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                showPreferences
                  ? "bg-teal-600 text-white border-teal-700"
                  : "text-gray-600 bg-white border-gray-200 hover:border-teal-300 hover:text-teal-700"
              }`}
            >
              <SlidersHorizontal size={14} /> Preferences
            </button>
          </div>
        </div>

        {showPreferences && <PreferencesPanel />}

        {/* Tabs */}
        <div className="flex gap-2">
          {(["all", "unread"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                tab === t
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"
              }`}
            >
              {t === "all" ? "All" : "Unread"}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-7 h-7 animate-spin text-teal-600 mb-2" />
              <p className="text-sm font-semibold text-gray-500">Loading notifications...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-gray-700 mb-1">You&apos;re all caught up</h2>
              <p className="text-sm text-gray-400">
                {tab === "unread"
                  ? "No unread notifications right now."
                  : "New notifications will show up here."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {items.map((item) => {
                const Icon = notificationIcon(item.type);
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => void openNotification(item)}
                      className={`w-full flex items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 ${
                        item.isRead ? "" : "bg-teal-50/40"
                      }`}
                    >
                      <span
                        className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          item.isRead ? "bg-gray-100 text-gray-400" : "bg-teal-100 text-teal-700"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-sm ${
                            item.isRead ? "font-medium text-gray-700" : "font-bold text-gray-900"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="block text-sm text-gray-500 line-clamp-2 mt-0.5">
                          {item.message}
                        </span>
                        <span className="block text-xs text-gray-400 mt-1">
                          {relativeTime(item.createdAt)}
                        </span>
                      </span>
                      {!item.isRead && (
                        <span className="mt-2 w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 disabled:opacity-40 hover:border-teal-300 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 disabled:opacity-40 hover:border-teal-300 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

/** Step B5 — 6 categories × (in-app, email) toggles. */
function PreferencesPanel() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getNotificationPreferences()
      .then((prefs) => {
        if (!cancelled) setPreferences(prefs);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (category: string, field: "inApp" | "email") => {
    setPreferences((prev) =>
      prev.map((p) =>
        p.category === category ? { ...p, [field]: !p[field] } : p
      )
    );
    setSavedAt(null);
  };

  const save = async () => {
    setIsSaving(true);
    try {
      const result = await updateNotificationPreferences(preferences);
      if (Array.isArray(result)) setPreferences(result);
      setSavedAt(Date.now());
    } catch {
      // keep local state; user can retry
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Notification preferences</h2>
          <p className="text-xs text-gray-500">
            Mentorship and session alerts are always delivered in-app.
          </p>
        </div>
        <button
          onClick={() => void save()}
          disabled={isSaving || isLoading}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? "Saving..." : savedAt ? "Saved ✓" : "Save"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          <div className="grid grid-cols-[1fr_5rem_5rem] gap-2 pb-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">
            <span>Category</span>
            <span className="text-center">In-app</span>
            <span className="text-center">Email</span>
          </div>
          {preferences.map((pref) => {
            const lockedInApp = LOCKED_IN_APP.has(pref.category);
            return (
              <div
                key={pref.category}
                className="grid grid-cols-[1fr_5rem_5rem] gap-2 items-center py-2.5"
              >
                <span className="text-sm font-semibold text-gray-700">
                  {CATEGORY_LABELS[pref.category] ?? pref.category}
                </span>
                <span className="flex justify-center">
                  <TogglePill
                    on={lockedInApp ? true : pref.inApp}
                    disabled={lockedInApp}
                    onClick={() => toggle(pref.category, "inApp")}
                    label={`${CATEGORY_LABELS[pref.category]} in-app`}
                  />
                </span>
                <span className="flex justify-center">
                  <TogglePill
                    on={pref.email}
                    onClick={() => toggle(pref.category, "email")}
                    label={`${CATEGORY_LABELS[pref.category]} email`}
                  />
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TogglePill({
  on,
  disabled,
  onClick,
  label,
}: {
  on: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`relative w-10 h-6 rounded-full transition-colors ${
        on ? "bg-teal-600" : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
          on ? "left-[calc(100%-1.35rem)]" : "left-0.5"
        }`}
      />
    </button>
  );
}
