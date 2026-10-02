"use client";

import Link from "next/link";
import { ArrowRight, Search, Video } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { resolveFileUrl, type PublicScholarship, type SessionListItem } from "@/lib/api";
import { formatSessionWhen } from "@/lib/sessionFormat";

function greeting(now: Date) {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/** "1 session coming up and 2 deadlines this month" — or a nudge when there's nothing. */
function statusLine(sessions: number, deadlines: number) {
  const parts: string[] = [];
  if (sessions > 0) parts.push(`${sessions} session${sessions === 1 ? "" : "s"} coming up`);
  if (deadlines > 0) parts.push(`${deadlines} scholarship deadline${deadlines === 1 ? "" : "s"} in the next 30 days`);
  if (parts.length === 0) return "A quiet week. A good time to talk to a mentor about your plan.";
  return `You have ${parts.join(" and ")}.`;
}

interface StudentWelcomeProps {
  firstName: string;
  sessions: SessionListItem[];
  scholarships: PublicScholarship[];
  isLoading: boolean;
}

export default function StudentWelcome({ firstName, sessions, scholarships, isLoading }: StudentWelcomeProps) {
  const now = new Date();
  const in30Days = now.getTime() + 30 * 86_400_000;
  const deadlines = scholarships.filter((s) => {
    if (!s.deadline) return false;
    const t = new Date(s.deadline).getTime();
    return t >= now.getTime() && t <= in30Days;
  }).length;
  const next = sessions[0];
  const dateLine = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(now);

  return (
    <header className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
      <div>
        <p className="font-hand text-xl text-maroon">{dateLine}</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] text-ink md:text-5xl">
          {greeting(now)}, {firstName}.
        </h1>
        <p className="mt-3 max-w-xl text-ink-soft">{isLoading ? " " : statusLine(sessions.length, deadlines)}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/mentors" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-semibold text-paper hover:bg-forest">
            <Search size={17} /> Find a mentor
          </Link>
          <Link href="/dashboard/student/orders" className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-5 py-2 font-semibold text-ink hover:border-ink">
            My orders
          </Link>
        </div>
      </div>

      {/* Next session — a dark card, because it's the one thing with a time attached */}
      {next ? (
        <div className="rounded-[24px] bg-forest p-5 text-paper">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-seagreen">Next session</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-paper/10 text-sm font-bold">
              <Avatar src={resolveFileUrl(next.counterpart.profileImage)} name={next.counterpart.firstName} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold">{next.title}</p>
              <p className="truncate text-sm text-paper/70">
                with {next.counterpart.firstName} · {formatSessionWhen(next.scheduledAt)}
              </p>
            </div>
          </div>
          <Link
            href={next.canJoin ? `/session/${next.id}/call` : "/dashboard/student/sessions"}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-seagreen px-4 py-2 text-sm font-semibold text-ink hover:bg-paper"
          >
            {next.canJoin ? (
              <>
                <Video size={16} /> Join now
              </>
            ) : (
              <>
                All sessions <ArrowRight size={16} />
              </>
            )}
          </Link>
        </div>
      ) : (
        !isLoading && (
          <div className="rounded-[24px] border-2 border-dashed border-ink/15 p-5">
            <p className="font-display text-lg font-bold text-ink">No sessions booked</p>
            <p className="mt-1 text-sm text-ink-soft">Once a mentor accepts your request, you can schedule a call together.</p>
          </div>
        )
      )}
    </header>
  );
}
