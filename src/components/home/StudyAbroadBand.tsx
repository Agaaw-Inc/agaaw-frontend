import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicScholarship } from "@/lib/api";
import { daysUntil } from "@/lib/homeData";
import SectionHeading from "@/components/ui/SectionHeading";

interface StudyAbroadBandProps {
  scholarships: PublicScholarship[];
  scholarshipCount: number;
  countryCount: number;
}

function deadlineLabel(iso: string) {
  const days = daysUntil(iso);
  if (days === 0) return "Closes today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

/** Real scholarships, real deadlines — free to browse. */
export default function StudyAbroadBand({ scholarships, scholarshipCount, countryCount }: StudyAbroadBandProps) {
  return (
    <section className="bg-forest text-paper">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:py-28 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <SectionHeading
            tone="light"
            eyebrow="Free to browse"
            title="Scholarships and country guides"
            description="Scholarships, country guides and mentors who made the move themselves — all in one place, free to browse."
          />

          {(scholarshipCount > 0 || countryCount > 0) && (
            <dl className="mt-10 max-w-md divide-y divide-paper/15 border-y border-paper/15">
              {scholarshipCount > 0 && (
                <div className="flex items-baseline justify-between py-4">
                  <dt className="text-sm uppercase tracking-[0.16em] text-paper/60">Scholarships listed</dt>
                  <dd className="text-3xl font-extrabold text-seagreen">{scholarshipCount}</dd>
                </div>
              )}
              {countryCount > 0 && (
                <div className="flex items-baseline justify-between py-4">
                  <dt className="text-sm uppercase tracking-[0.16em] text-paper/60">Country guides</dt>
                  <dd className="text-3xl font-extrabold text-seagreen">{countryCount}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/scholarships" className="inline-flex items-center gap-2 rounded-full bg-seagreen px-6 py-3 font-semibold text-ink transition-colors hover:bg-paper">
              All scholarships <ArrowRight size={18} />
            </Link>
            <Link href="/countries" className="inline-flex items-center gap-2 rounded-full border-2 border-paper/30 px-6 py-3 font-semibold text-paper transition-colors hover:border-paper">
              Country guides
            </Link>
          </div>
        </div>

        {/* Next deadlines */}
        <div>
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-xl font-bold">Next deadlines</h3>
            <span className="text-sm text-paper/60">soonest first</span>
          </div>

          {scholarships.length === 0 ? (
            <p className="rounded-3xl bg-paper/5 p-8 text-paper/70">
              No upcoming deadlines right now. <Link href="/scholarships" className="underline">Browse every scholarship</Link>.
            </p>
          ) : (
            <ul className="space-y-3">
              {scholarships.map((s) => {
                const days = daysUntil(s.deadline!);
                return (
                  <li key={s.id}>
                    <Link
                      href={`/scholarships/${s.slug}`}
                      className="group flex items-center gap-4 rounded-3xl bg-card p-4 text-ink transition-transform hover:-translate-y-0.5 sm:p-5"
                    >
                      {s.countryFlagImage ? (
                        // eslint-disable-next-line @next/next/no-img-element -- flags come from several CDNs
                        <img src={s.countryFlagImage} alt="" className="h-9 w-12 shrink-0 rounded-md object-cover ring-1 ring-ink/10" />
                      ) : (
                        <span className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md bg-paper-deep text-xs font-bold">{s.country.slice(0, 2)}</span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{s.name}</p>
                        <p className="truncate text-sm text-ink-soft">
                          {s.provider} · {s.country}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${days <= 7 ? "bg-maroon text-white" : "bg-paper-deep text-ink"}`}
                      >
                        {deadlineLabel(s.deadline!)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
