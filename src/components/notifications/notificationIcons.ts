import {
  AlarmClock,
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarClock,
  ClipboardList,
  CreditCard,
  FileSearch,
  Globe,
  Lightbulb,
  Megaphone,
  MessageSquare,
  Star,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import type { NotificationType } from "@/services/notificationService";

/** Type → icon map (Step B2). */
const ICONS: Partial<Record<NotificationType, LucideIcon>> = {
  scholarship_new: Award,
  scholarship_match: Award,
  country_match: Globe,
  blog_match: BookOpen,
  request_received: UserPlus,
  request_accepted: UserPlus,
  request_declined: UserPlus,
  request_withdrawn: UserPlus,
  session_booked: CalendarClock,
  session_confirmed: CalendarClock,
  session_cancelled: CalendarClock,
  session_completed: CalendarClock,
  session_rescheduled: CalendarClock,
  session_reminder: CalendarClock,
  message_received: MessageSquare,
  deadline_reminder: AlarmClock,
  announcement: Megaphone,
  general: Megaphone,
  mentor_approved: BadgeCheck,
  payment_completed: CreditCard,
  profile_tip: Lightbulb,
  application_update: ClipboardList,
  review_received: Star,
  document_viewed: FileSearch,
};

export function notificationIcon(type: NotificationType): LucideIcon {
  return ICONS[type] ?? Bell;
}

/** Relative "5m ago" style timestamp. */
export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
