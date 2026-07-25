import Link from "next/link";
import { CalendarDays, UserRound } from "lucide-react";
import { counterpartFullName, type ConversationListItem } from "@/lib/chat";
import type { DashboardMessageRole } from "./DashboardMessagesPage";
import ParticipantAvatar from "./ParticipantAvatar";

interface ConversationHeaderProps {
  conversation: ConversationListItem;
  role: DashboardMessageRole;
}

export default function ConversationHeader({ conversation, role }: ConversationHeaderProps) {
  const { counterpart } = conversation;
  const profileHref =
    counterpart.role === "mentor"
      ? `/profile/mentor/${counterpart.id}`
      : `/profile/student/${counterpart.id}`;
  const sessionsHref = `/dashboard/${role}/sessions`;

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <ParticipantAvatar participant={counterpart} size="lg" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-bold text-slate-950 sm:text-lg">
              {counterpartFullName(counterpart)}
            </h2>
            {counterpart.title && (
              <span className="text-sm font-semibold text-[#0F766E]">{counterpart.title}</span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>
              {counterpart.isOnline ? "Active now" : counterpart.location || "Offline"}
            </span>
            {conversation.subject && (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{conversation.subject}</span>
              </>
            )}
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
        <Link
          href={sessionsHref}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-[#0B625C]"
        >
          <CalendarDays className="h-4 w-4" />
          Schedule Session
        </Link>
      </div>
    </header>
  );
}
