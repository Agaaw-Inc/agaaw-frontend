/**
 * Notification system API layer (Step B1).
 * User endpoints (6) + admin announcement endpoints, matching the backend
 * contract in agaaw-backend/src/modules/notifications.
 */

import { authFetchJson } from "@/lib/authFetch";

// ── Types ──────────────────────────────────────────────────────────────────

export type NotificationType =
  | "request_received"
  | "request_accepted"
  | "request_declined"
  | "request_withdrawn"
  | "session_booked"
  | "session_confirmed"
  | "session_cancelled"
  | "session_completed"
  | "session_rescheduled"
  | "session_reminder"
  | "message_received"
  | "scholarship_new"
  | "scholarship_match"
  | "country_match"
  | "blog_match"
  | "deadline_reminder"
  | "review_received"
  | "profile_tip"
  | "announcement"
  | "document_viewed"
  | "mentor_approved"
  | "payment_completed"
  | "application_update"
  | "general"
  // legacy values that may exist on old rows
  | "bid_received"
  | "bid_accepted"
  | "bid_rejected";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  entityType: string | null;
  entityId: string | null;
  link: string | null;
}

export interface PaginatedNotifications {
  data: NotificationItem[];
  meta: { page: number; limit: number; total: number };
}

export interface NotificationPreference {
  category:
    | "content_matches"
    | "platform_news"
    | "mentorship"
    | "sessions"
    | "messages"
    | "reminders";
  inApp: boolean;
  email: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  audience: "all" | "students" | "mentors";
  link: string | null;
  sentCount: number;
  sentBy: string;
  createdAt: string;
}

export interface PaginatedAnnouncements {
  data: AnnouncementItem[];
  meta: { page: number; limit: number; total: number };
}

export interface AnnouncementDetail {
  id: string;
  title: string;
  message: string;
  audience: "all" | "students" | "mentors";
  link: string | null;
  sentBy: string;
  createdAt: string;
}

// ── User endpoints ─────────────────────────────────────────────────────────

export async function getNotifications(
  filter: "all" | "unread" = "all",
  page = 1,
  limit = 20
): Promise<PaginatedNotifications> {
  const result = await authFetchJson<PaginatedNotifications>(
    `/notifications?filter=${filter}&page=${page}&limit=${limit}`
  );
  return result ?? { data: [], meta: { page, limit, total: 0 } };
}

/** Full content for an announcement's dedicated detail page. */
export async function getAnnouncementDetail(id: string): Promise<AnnouncementDetail> {
  return authFetchJson<AnnouncementDetail>(`/announcements/${id}`);
}

export async function getUnreadNotificationCount(): Promise<number> {
  const result = await authFetchJson<{ total: number }>(
    "/notifications/unread-count"
  );
  return result?.total ?? 0;
}

export async function markNotificationRead(id: string) {
  return authFetchJson(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead(): Promise<{ updatedCount: number }> {
  return authFetchJson("/notifications/read-all", { method: "PATCH" });
}

export async function getNotificationPreferences(): Promise<NotificationPreference[]> {
  const result = await authFetchJson<NotificationPreference[]>(
    "/notification-preferences"
  );
  return Array.isArray(result) ? result : [];
}

export async function updateNotificationPreferences(
  preferences: NotificationPreference[]
): Promise<NotificationPreference[]> {
  return authFetchJson("/notification-preferences", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(preferences),
  });
}

// ── Admin endpoints ────────────────────────────────────────────────────────

export async function createAnnouncement(data: {
  title: string;
  message: string;
  audience: "all" | "students" | "mentors";
  link?: string;
}): Promise<{ id: string; sentCount: number }> {
  return authFetchJson("/admin/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getAnnouncements(
  page = 1,
  limit = 20
): Promise<PaginatedAnnouncements> {
  const result = await authFetchJson<PaginatedAnnouncements>(
    `/admin/announcements?page=${page}&limit=${limit}`
  );
  return result ?? { data: [], meta: { page, limit, total: 0 } };
}

export async function getAnnouncementAudienceSize(
  audience: "all" | "students" | "mentors"
): Promise<number> {
  const result = await authFetchJson<{ count: number }>(
    `/admin/announcements/audience-size/${audience}`
  );
  return result?.count ?? 0;
}

// ── Client-side link safety (Step B8, defense-in-depth) ───────────────────

/** Internal navigations must be same-origin relative paths. */
export function isSafeInternalLink(link: string | null): link is string {
  return !!link && link.startsWith("/") && !link.startsWith("//");
}

/** Announcement links may also be https:// — opened in a new tab. */
export function isSafeExternalLink(link: string | null): link is string {
  return !!link && /^https:\/\//i.test(link);
}
