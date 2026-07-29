"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getChatSocket } from "@/lib/chatSocket";
import { getToken } from "@/lib/auth";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
} from "@/services/notificationService";

/** Types that surface a toast when they arrive live (Step B4). */
const TOAST_TYPES = new Set([
  "request_received",
  "request_accepted",
  "session_reminder",
  "session_booked",
  "announcement",
]);

/** Window event used to sync the badge across components after mark-read. */
export const NOTIFICATION_CHANGE_EVENT = "agaaw-notification-change";

export function emitNotificationChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NOTIFICATION_CHANGE_EVENT));
  }
}

/**
 * Live unread-notification total for the bell badge. Socket-driven with a
 * 60s polling fallback. Independent from the chat/messages badge.
 *
 * `onLiveNotification` (optional) fires for every `notification:new` socket
 * push, with `shouldToast` precomputed per the B4 type list.
 */
export function useUnreadNotifications(
  loggedIn: boolean,
  onLiveNotification?: (item: NotificationItem, shouldToast: boolean) => void
): number {
  const [unread, setUnread] = useState(0);
  const callbackRef = useRef(onLiveNotification);
  callbackRef.current = onLiveNotification;

  useEffect(() => {
    if (!loggedIn || !getToken()) {
      setUnread(0);
      return;
    }

    let cancelled = false;
    const refresh = () => {
      getUnreadNotificationCount()
        .then((total) => {
          if (!cancelled) setUnread(total);
        })
        .catch(() => {});
    };

    refresh();
    const interval = window.setInterval(refresh, 60_000); // poll fallback

    const socket = getChatSocket();
    const onNotificationNew = (item: NotificationItem) => {
      setUnread((count) => count + 1);
      callbackRef.current?.(item, TOAST_TYPES.has(item.type));
    };

    socket.on("notification:new", onNotificationNew);
    socket.on("connect", refresh);
    window.addEventListener(NOTIFICATION_CHANGE_EVENT, refresh);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      socket.off("notification:new", onNotificationNew);
      socket.off("connect", refresh);
      window.removeEventListener(NOTIFICATION_CHANGE_EVENT, refresh);
    };
  }, [loggedIn]);

  return unread;
}

/** Paginated notification list with mark-read helpers (dropdown + pages). */
export function useNotificationList(
  filter: "all" | "unread",
  page: number,
  limit = 20,
  enabled = true
) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(() => {
    if (!enabled) return;
    let cancelled = false;
    setIsLoading(true);
    getNotifications(filter, page, limit)
      .then((result) => {
        if (cancelled) return;
        setItems(result.data);
        setTotal(result.meta.total);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter, page, limit, enabled]);

  useEffect(() => {
    const cancel = reload();
    return cancel;
  }, [reload]);

  // Live prepend when a new notification arrives while the list is open
  useEffect(() => {
    if (!enabled) return;
    const socket = getChatSocket();
    const onNew = (item: NotificationItem) => {
      if (page === 1 && (filter === "all" || !item.isRead)) {
        setItems((prev) =>
          prev.some((existing) => existing.id === item.id)
            ? prev
            : [item, ...prev].slice(0, limit)
        );
        setTotal((t) => t + 1);
      }
    };
    socket.on("notification:new", onNew);
    return () => {
      socket.off("notification:new", onNew);
    };
  }, [enabled, page, filter, limit]);

  const markRead = useCallback(async (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
    try {
      await markNotificationRead(id);
    } catch {
      // stale/foreign id — list refresh will reconcile
    }
    emitNotificationChange();
  }, []);

  const markAllRead = useCallback(async () => {
    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
    try {
      await markAllNotificationsRead();
    } catch {}
    emitNotificationChange();
  }, []);

  return { items, total, isLoading, reload, markRead, markAllRead };
}
