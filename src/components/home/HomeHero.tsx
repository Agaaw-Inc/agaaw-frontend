import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Real Agaaw people — never stock photos. The captions are deliberately
 * plain (name + role); update them here if a mentor's details change.
 */
const POLAROIDS = [
  { src: "/mentors/fuad.JPG", name: "Fuad", note: "mentor", rotate: "-rotate-6", position: "left-0 top-10" },
  { src: "/mentors/joy.JPG", name: "Joy", note: "mentor", rotate: "rotate-[5deg]", position: "right-0 top-0" },
];

/** The "I need help with" chips; each filters the mentors by expertise. */
export const HELP_TOPICS = [
  "Scholarship Essays",
  "Student Visa",
  "IELTS Strategy",
  "Financial Aid",
  "Interview Coaching",
];

interface HomeHeroProps {
  mentorCount: number;
  scholarshipCount: number;
  /** The topic currently filtered, highlighted. */
  activeTopic?: string;
}

export default function HomeHero({ mentorCount, scholarshipCount, activeTopic }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden bg-paper paper-grain">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-14 md:pt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:pb-28">
        {/* Words */}
        <div>
          <p className="mb-6 inline-flex items-baseline gap-3 text-ink-soft">
            <span className="text-2xl font-bold text-elm" lang="bn">আগাও</span>
            <span className="text-lg">— it means “move forward”</span>
          </p>

          <h1 className="text-[2.6rem] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink sm:text-6xl xl:text-[4.4rem]">
            Ask someone{" "}
            <br className="hidden sm:block" />
            who&apos;s{" "}
            <span className="relative whitespace-nowrap">
              already done it.
              {/* hand-drawn underline */}
              <svg aria-hidden="true" viewBox="0 0 300 14" className="absolute -bottom-2 left-0 h-3 w-full text-seagreen" preserveAspectRatio="none">
                <path d="M2 9 C 60 3, 120 12, 180 6 S 270 4, 298 8" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
            Agaaw connects you with mentors who have already won the scholarship, got the visa and made the
            move abroad — so you don&apos;t have to figure it out alone.
          </p>

          {/* Topic picker */}
          <div className="mt-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">I need help with</p>
            <div className="flex flex-wrap gap-2.5">
              {HELP_TOPICS.map((topic) => (
                <Link
                  key={topic}
                  href={activeTopic === topic ? "/mentors" : `/mentors?expertise=${encodeURIComponent(topic)}`}
                  scroll={false}
                  aria-pressed={activeTopic === topic}
                  className={`group inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-5 py-2.5 text-[15px] font-semibold transition-colors hover:bg-ink hover:text-paper ${
                    activeTopic === topic ? "bg-ink text-paper" : "bg-card text-ink"
                  }`}
                >
                  {topic}
                  <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Real numbers, not adjectives */}
          {(mentorCount > 0 || scholarshipCount > 0) && (
            <p className="mt-10 text-sm text-ink-soft">
              {mentorCount > 0 && (
                <>
                  <strong className="font-semibold text-ink">{mentorCount} approved mentor{mentorCount === 1 ? "" : "s"}</strong> ·{" "}
                </>
              )}
              {scholarshipCount > 0 && (
                <>
                  <strong className="font-semibold text-ink">{scholarshipCount} scholarship{scholarshipCount === 1 ? "" : "s"}</strong> listed ·{" "}
                </>
              )}
              pay by bKash, held safely until the work is done
            </p>
          )}
        </div>

        {/* Faces */}
        <div className="relative mx-auto h-[460px] w-full max-w-[460px] sm:h-[520px]">
          {POLAROIDS.map((p) => (
            <figure
              key={p.name}
              className={`absolute ${p.position} ${p.rotate} w-[62%] bg-white p-3 pb-4 shadow-[0_18px_40px_-12px_rgba(23,33,30,0.35)] transition-transform duration-300 hover:rotate-0`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep">
                <Image src={p.src} alt={`${p.name}, an Agaaw mentor`} fill sizes="(min-width: 1024px) 280px, 60vw" className="object-cover" priority />
              </div>
              <figcaption className="mt-3 whitespace-nowrap px-1 text-base font-semibold leading-none text-ink">
                {p.name} <span className="text-ink-soft">· {p.note}</span>
              </figcaption>
            </figure>
          ))}

          {/* Margin note */}
          <p className="absolute -bottom-2 right-2 max-w-[13rem] text-right text-sm font-bold uppercase leading-snug tracking-[0.14em] text-maroon">
            real mentors,
            <br />
            not stock photos
            <svg aria-hidden="true" viewBox="0 0 80 50" className="absolute -top-10 -left-12 h-10 w-16 -scale-x-100 rotate-[200deg] text-maroon">
              <path d="M5 40 C 30 42, 55 30, 70 8 M70 8 l-12 3 M70 8 l1 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </p>
        </div>
      </div>

      {/* Kantha stitch hem */}
      <div className="stitch mx-auto max-w-7xl text-ink/15" />
    </section>
  );
}
