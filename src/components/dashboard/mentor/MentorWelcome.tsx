"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { resolveFileUrl } from "@/lib/api";
import { calculateMentorProfileCompletion } from "@/lib/mentorProfileUtils";
import Card from "@/components/ui/Card";

function greeting(now: Date) {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export interface MentorStat {
  label: string;
  value: string;
  sub?: string;
}

interface MentorWelcomeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the mentor profile is untyped in lib/api
  profile: any;
  isLoading: boolean;
  stats: MentorStat[];
}

export default function MentorWelcome({ profile, isLoading, stats }: MentorWelcomeProps) {
  const now = new Date();
  const firstName = profile?.user?.firstName || "Mentor";
  const { percentage } = calculateMentorProfileCompletion(profile);
  const dateLine = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(now);

  return (
    <header className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
        <div className="flex items-start gap-5">
          <div className="relative hidden h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-paper-deep text-2xl font-bold text-ink sm:flex">
            <Avatar src={resolveFileUrl(profile?.user?.profileImage)} name={firstName} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink-soft">{dateLine}</p>
            <h1 className="mt-1 text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] text-ink md:text-5xl">
              {greeting(now)}, {isLoading ? "…" : firstName}.
            </h1>
          </div>
        </div>

        {/* Profile completeness — a plain bar, no gradient card */}
        <Card padding="sm" className="p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-ink">Profile complete</p>
            <p className="text-2xl font-extrabold text-ink">{isLoading ? "—" : `${percentage}%`}</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper-deep">
            <div className="h-full rounded-full bg-elm transition-all duration-700" style={{ width: `${isLoading ? 0 : percentage}%` }} />
          </div>
          {!isLoading && percentage < 100 && (
            <Link href="/dashboard/mentor/profile" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-elm hover:underline">
              Finish your profile <ArrowRight size={14} />
            </Link>
          )}
        </Card>
      </div>

      {/* Numbers on hairlines, not coloured icon tiles */}
      <dl className="grid grid-cols-2 gap-y-6 border-y border-ink/10 py-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border-l-2 border-ink/10 pl-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{stat.label}</dt>
            <dd className="mt-1 text-3xl font-extrabold text-ink">{stat.value}</dd>
            {stat.sub && <dd className="text-sm text-ink-soft">{stat.sub}</dd>}
          </div>
        ))}
      </dl>
    </header>
  );
}
