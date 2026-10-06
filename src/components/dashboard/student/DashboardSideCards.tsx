"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { resolveFileUrl, type ConnectionItem } from "@/lib/api";
import type { TargetCountry } from "@/hooks/useStudentDashboard";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";

function SideCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card as="section">
      <SectionHeading size="card" as="h2" title={title} action={action} className="mb-4" />
      {children}
    </Card>
  );
}

export function MyMentorsCard({ mentors, isLoading }: { mentors: ConnectionItem[]; isLoading: boolean }) {
  return (
    <SideCard
      title="Your mentors"
      action={
        mentors.length > 0 ? (
          <Link href="/dashboard/student/mentors" className="text-sm font-semibold text-elm hover:underline">
            All
          </Link>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="h-16 animate-pulse rounded-2xl bg-paper-deep" />
      ) : mentors.length === 0 ? (
        <p className="text-sm text-ink-soft">
          No mentors yet.{" "}
          <Link href="/mentors" className="font-semibold text-ink underline">
            Find one
          </Link>{" "}
          — requests are free.
        </p>
      ) : (
        <ul className="space-y-3">
          {mentors.slice(0, 4).map((c) => (
            <li key={c.id} className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-paper-deep text-sm font-bold text-ink">
                <Avatar src={resolveFileUrl(c.counterpart.profileImage)} name={c.counterpart.firstName} />
              </div>
              <Link href={`/profile/mentor/${c.counterpart.id}`} className="min-w-0 flex-1 truncate font-semibold text-ink hover:underline">
                {c.counterpart.firstName} {c.counterpart.lastName}
              </Link>
              <Link
                href="/dashboard/student/messages"
                aria-label={`Message ${c.counterpart.firstName}`}
                className="rounded-full p-2 text-ink-soft hover:bg-paper-deep hover:text-ink"
              >
                <MessageCircle size={18} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SideCard>
  );
}

export function TargetCountriesCard({ countries, isLoading }: { countries: TargetCountry[]; isLoading: boolean }) {
  return (
    <SideCard title="Where you're aiming">
      {isLoading ? (
        <div className="h-10 animate-pulse rounded-2xl bg-paper-deep" />
      ) : countries.length === 0 ? (
        <p className="text-sm text-ink-soft">
          <Link href="/dashboard/student/profile" className="font-semibold text-ink underline">
            Add target countries
          </Link>{" "}
          to get scholarships matched to them.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {countries.map((country) => (
            <Link
              key={country.id}
              href={`/countries/${country.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-sm font-semibold text-ink ring-1 ring-ink/10 hover:ring-ink/40"
            >
              {country.flagImage && (
                // eslint-disable-next-line @next/next/no-img-element -- flags come from several CDNs
                <img src={country.flagImage} alt="" className="h-3.5 w-5 rounded-[2px] object-cover" />
              )}
              {country.name}
            </Link>
          ))}
        </div>
      )}
    </SideCard>
  );
}
