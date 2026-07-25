import { authFetch } from "./authFetch";

// ── Types (mirror the chat backend responses) ─────────────────────────────

export type ChatRole = "student" | "mentor" | "admin";
export type ChatAttachmentType = "pdf" | "doc" | "image";

export interface ChatCounterpart {
  id: string;
  firstName: string;
  lastName: string;
  role: ChatRole;
  profileImage: string | null;
  title: string | null;
  location: string | null;
  isOnline: boolean;
}

export interface ConversationListItem {
  id: string;
  connectionId: string;
  connectionStatus: "active" | "ended";
  subject: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  counterpart: ChatCounterpart;
  lastMessage: { body: string; senderId: string; createdAt: string } | null;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: ChatAttachmentType;
  sizeBytes: number;
  url: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  clientRef: string | null;
  readAt: string | null;
  createdAt: string;
  attachments: ChatAttachment[];
  /** Client-only flags for optimistic rendering */
  pending?: boolean;
  failed?: boolean;
}

export interface MessagesPage {
  data: ChatMessage[];
  meta: { nextCursor: string | null };
}

// ── REST calls ────────────────────────────────────────────────────────────

function extractErrorMessage(json: any, fallback: string): string {
  const msg = json?.message;
  if (Array.isArray(msg)) return msg.join(", ");
  return msg || fallback;
}

export async function getConversations(): Promise<ConversationListItem[]> {
  const res = await authFetch("/conversations", { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to load conversations"));
  }
  return Array.isArray(json.data) ? json.data : [];
}

export async function getChatMessages(
  conversationId: string,
  cursor?: string,
  limit = 30
): Promise<MessagesPage> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  const res = await authFetch(
    `/conversations/${conversationId}/messages?${params.toString()}`,
    { cache: "no-store" }
  );
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to load messages"));
  }
  return json.data || { data: [], meta: { nextCursor: null } };
}

export async function sendChatMessage(
  conversationId: string,
  data: { body: string; clientRef: string; attachmentIds?: string[] }
): Promise<ChatMessage> {
  const res = await authFetch(`/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to send message"));
  }
  return json.data;
}

export async function markConversationRead(
  conversationId: string
): Promise<{ updatedCount: number; readAt: string }> {
  const res = await authFetch(`/conversations/${conversationId}/read`, {
    method: "PATCH",
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to mark conversation read"));
  }
  return json.data;
}

export async function getUnreadMessageCount(): Promise<number> {
  const res = await authFetch("/conversations/unread-count", { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) return 0;
  return json.data?.total ?? 0;
}

export async function uploadChatAttachment(
  conversationId: string,
  file: File
): Promise<ChatAttachment> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await authFetch(`/conversations/${conversationId}/attachments`, {
    method: "POST",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to upload attachment"));
  }
  return json.data;
}

/**
 * Attachment downloads are JWT-guarded, so a plain <a href> won't work.
 * Fetch the file with auth and trigger a browser download.
 */
export async function downloadChatAttachment(attachment: ChatAttachment): Promise<void> {
  const res = await authFetch(attachment.url);
  if (!res.ok) {
    throw new Error("Failed to download attachment");
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = attachment.name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

// ── Formatting helpers ────────────────────────────────────────────────────

export function formatFileSize(sizeBytes: number): string {
  if (sizeBytes >= 1024 * 1024) return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  if (sizeBytes >= 1024) return `${Math.round(sizeBytes / 1024)} KB`;
  return `${sizeBytes} B`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** "10:24 AM" — used inside the thread */
export function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "10:24 AM" today, "Yesterday", "Oct 12", "Oct 12, 2025" — used in the list */
export function formatConversationTime(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  if (isSameDay(date, now)) return formatMessageTime(iso);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return "Yesterday";
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** "Today", "Yesterday", "July 12, 2026" — thread day dividers */
export function formatDayLabel(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  if (isSameDay(date, now)) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function isSameChatDay(isoA: string, isoB: string): boolean {
  return isSameDay(new Date(isoA), new Date(isoB));
}

export function counterpartFullName(counterpart: ChatCounterpart): string {
  return `${counterpart.firstName} ${counterpart.lastName}`.trim();
}
