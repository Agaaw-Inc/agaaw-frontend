"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import { saveScholarship, unsaveScholarship, type PublicScholarship } from "@/lib/api";
import type { TargetCountry } from "@/hooks/useStudentDashboard";

type Tab = "soon" | "countries" | "saved";

const COVERAGE_LABEL: Record<string, string> = {
  fully_funded: "Fully funded",
  full: "Fully funded",
  partial: "Partial funding",
  varies: "Funding varies",
};

const LEVEL_LABEL: Record<string, string> = {
  bachelors: "Bachelor's",
  masters: "Master's",
  phd: "PhD",
  other: "Other",
};

const FALLBACK_BANNER = "/images/scholarship-agaaw.png";
const SHOW = 6;

function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
}

function DeadlinePill({ deadline }: { deadline: string | null }) {
  const days = daysLeft(deadline);
  if (days === null) return <span className="rounded-full bg-paper-deep px-3 py-1 text-xs font-bold text-ink-soft">Rolling</span>;
  if (days < 0) return <span className="rounded-full bg-ink/10 px-3 py-1 text-xs font-bold text-ink-soft">Closed</span>;
  const urgent = days <= 14;
  return (
    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${urgent ? "bg-brick text-white" : "bg-marigold/40 text-ink"}`}>
      {days === 0 ? "Closes today" : `${days} day${days === 1 ? "" : "s"} left`}
    </span>
  );
}

interface ScholarshipBoardProps {
  scholarships: PublicScholarship[];
  savedIds: Set<string>;
  targetCountries: TargetCountry[];
  isLoading: boolean;
  onSavedChange: (next: Set<string>) => void;
}

/**
 * The scholarship list on the student dashboard: three views of one list
 * that was loaded once — soonest deadlines, the student's target countries,
 * and what they saved.
 */
export default function ScholarshipBoard({ scholarships, savedIds, targetCountries, isLoading, onSavedChange }: ScholarshipBoardProps) {
  const [tab, setTab] = useState<Tab>("soon");
  const [busyId, setBusyId] = useState<string | null>(null);

  const targetSlugs = useMemo(() => new Set(targetCountries.map((c) => c.slug)), [targetCountries]);

  const rows = useMemo(() => {
    const now = Date.now();
    const open = scholarships.filter((s) => !s.deadline || new Date(s.deadline).getTime() >= now);
    const bySoonest = (a: PublicScholarship, b: PublicScholarship) =>
      (a.deadline ? new Date(a.deadline).getTime() : Infinity) - (b.deadline ? new Date(b.deadline).getTime() : Infinity);

    if (tab === "countries") return open.filter((s) => targetSlugs.has(s.countrySlug)).sort(bySoonest);
    if (tab === "saved") return scholarships.filter((s) => savedIds.has(s.id)).sort(bySoonest);
    return open.sort(bySoonest);
  }, [scholarships, tab, targetSlugs, savedIds]);

  // Optimistic: flip the bookmark immediately, undo it if the request fails.
  const toggleSave = async (id: string) => {
    if (busyId) return;
    const wasSaved = savedIds.has(id);
    const next = new Set(savedIds);
    if (wasSaved) next.delete(id);
    else next.add(id);
    onSavedChange(next);
    setBusyId(id);
    try {
      if (wasSaved) await unsaveScholarship(id);
      else await saveScholarship(id);
    } catch {
      onSavedChange(savedIds);
    } finally {
      setBusyId(null);
    }
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "soon", label: "Closing soon" },
    { key: "countries", label: "My countries" },
    { key: "saved", label: "Saved", count: savedIds.size },
  ];

  return (
    <section className="rounded-[28px] bg-card p-5 ring-1 ring-ink/10 sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">Scholarships for you</h2>
        <div role="tablist" aria-label="Scholarship views" className="flex gap-1 rounded-full bg-paper-deep p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${tab === t.key ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"}`}
            >
              {t.label}
              {t.count ? <span className="ml-1.5 opacity-70">{t.count}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <ul className="space-y-3" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="h-24 animate-pulse rounded-2xl bg-paper-deep" />
            ))}
          </ul>
        ) : rows.length === 0 ? (
          <EmptyState tab={tab} hasTargets={targetCountries.length > 0} />
        ) : (
          <ul className="space-y-3">
            {rows.slice(0, SHOW).map((s) => {
              const saved = savedIds.has(s.id);
              return (
                <li key={s.id} className="group flex gap-4 rounded-2xl p-2 transition-colors hover:bg-paper sm:p-3">
                  <Link href={`/scholarships/${s.slug}`} className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-paper-deep sm:block">
                    {/* eslint-disable-next-line @next/next/no-img-element -- banners come from admin-entered URLs on several hosts */}
                    <img src={s.bannerImage || FALLBACK_BANNER} alt="" className="h-full w-full object-cover" />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/scholarships/${s.slug}`} className="min-w-0">
                        <p className="line-clamp-2 font-semibold leading-snug text-ink group-hover:underline">{s.name}</p>
                      </Link>
                      <DeadlinePill deadline={s.deadline} />
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-ink-soft">
                      {s.countryFlagImage && (
                        // eslint-disable-next-line @next/next/no-img-element -- flags come from several CDNs
                        <img src={s.countryFlagImage} alt="" className="h-3 w-4 shrink-0 rounded-[2px] object-cover" />
                      )}
                      <span className="truncate">
                        {s.country} · {s.provider}
                      </span>
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {COVERAGE_LABEL[s.coverage] && (
                        <span className="rounded-md bg-elm/10 px-2 py-0.5 text-xs font-semibold text-elm">{COVERAGE_LABEL[s.coverage]}</span>
                      )}
                      {s.level.slice(0, 3).map((l) => (
                        <span key={l} className="rounded-md bg-paper-deep px-2 py-0.5 text-xs font-medium text-ink-soft">
                          {LEVEL_LABEL[l] ?? l}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void toggleSave(s.id)}
                    disabled={busyId === s.id}
                    aria-pressed={saved}
                    aria-label={saved ? `Remove ${s.name} from saved` : `Save ${s.name}`}
                    className={`self-start rounded-full p-2 transition-colors ${saved ? "text-elm" : "text-ink-soft hover:bg-paper-deep hover:text-ink"}`}
                  >
                    {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-5 text-sm">
        <span className="text-ink-soft">
          {rows.length > SHOW ? `Showing ${SHOW} of ${rows.length}` : null}
        </span>
        <Link href="/scholarships" className="inline-flex items-center gap-1.5 font-semibold text-ink hover:underline">
          Browse all scholarships <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function EmptyState({ tab, hasTargets }: { tab: Tab; hasTargets: boolean }) {
  const content = {
    soon: { title: "No open deadlines right now", body: "New scholarships are added regularly.", href: "/scholarships", cta: "Browse all" },
    countries: hasTargets
      ? { title: "Nothing open in your countries yet", body: "We'll show them here as soon as they're listed.", href: "/scholarships", cta: "Browse all" }
      : { title: "Tell us where you want to study", body: "Add target countries and we'll match scholarships to them.", href: "/dashboard/student/profile", cta: "Add countries" },
    saved: { title: "Nothing saved yet", body: "Tap the bookmark on any scholarship to keep it here.", href: "/scholarships", cta: "Find some" },
  }[tab];

  return (
    <div className="rounded-2xl border-2 border-dashed border-ink/15 px-6 py-10 text-center">
      <p className="font-display text-lg font-bold text-ink">{content.title}</p>
      <p className="mt-1 text-sm text-ink-soft">{content.body}</p>
      <Link href={content.href} className="mt-4 inline-flex rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper hover:bg-forest">
        {content.cta}
      </Link>
    </div>
  );
}
