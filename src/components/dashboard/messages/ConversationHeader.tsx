import Link from "next/link";
import { CalendarDays, UserRound } from "lucide-react";
import type { DashboardConversation, DashboardMessageRole } from "@/data/messages";
import ParticipantAvatar from "./ParticipantAvatar";

interface ConversationHeaderProps {
  conversation: DashboardConversation;
  role: DashboardMessageRole;
}

export default function ConversationHeader({ conversation, role }: ConversationHeaderProps) {
  const participant = role === "mentor" ? conversation.student : conversation.mentor;
  const profileHref = role === "mentor" ? `/profile/${conversation.student.id}` : `/profile/${conversation.mentor.id}`;

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <ParticipantAvatar participant={participant} size="lg" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-bold text-slate-950 sm:text-lg">{participant.name}</h2>
            <span className="text-sm font-semibold text-[#0F766E]">{participant.title}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>{participant.isOnline ? "Active now" : participant.location}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{conversation.subject}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={profileHref}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-px hover:border-slate-400 hover:bg-slate-50"
        >
          <UserRound className="h-4 w-4" />
          View Profile
        </Link>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-[#0B625C]"
        >
          <CalendarDays className="h-4 w-4" />
          Schedule Session
        </button>
      </div>
    </header>
  );
}

