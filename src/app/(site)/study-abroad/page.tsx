import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import ScholarshipsPreview from "@/components/scholarships/ScholarshipsPreview";
import CountriesPreview from "@/components/countries/CountriesPreview";
import MentorCard from "@/components/mentors/MentorCard";
import { fromCategoryPreview } from "@/lib/mentorCards";
import { getCategoryBySlug, getCategoryMentors } from "@/lib/categories";
import { visualFor } from "@/lib/categoryVisuals";
import SectionHeading from "@/components/ui/SectionHeading";
import ArrowLink from "@/components/ui/ArrowLink";

export const metadata: Metadata = {
  title: "Study abroad | Agaaw",
  description: "Scholarships, country guides and mentors who are already studying abroad.",
};

const QUICK_LINKS = [
  { href: "/scholarships", title: "Scholarships", desc: "Funding by country, level and deadline." },
  { href: "/countries", title: "Country guides", desc: "Costs, visas, admissions and work rights." },
  { href: "/mentors?category=study-abroad", title: "Mentors", desc: "Students already living your plan." },
];

/**
 * The study-abroad hub: the platform's original features (scholarships,
 * countries, mentors) under one category. /categories/study-abroad
 * redirects here.
 */
export default async function StudyAbroadPage() {
  const visual = visualFor("study-abroad");
  // The page still renders its static content if the API is unreachable.
  const category = await getCategoryBySlug("study-abroad").catch(() => null);
  const preview = category ? await getCategoryMentors("study-abroad").catch(() => null) : null;
  const mentors = preview?.mentors.slice(0, 4) ?? [];

  return (
    <>
      <MainNavbar />

      <main className="bg-paper">
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-12 md:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            <SectionHeading
              size="display"
              eyebrow="Where Agaaw began"
              title="Study abroad"
              description={category?.description ?? visual.tagline}
            />

            <ul className="mt-10 divide-y-2 divide-ink/10 border-y-2 border-ink/10">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center justify-between gap-4 py-4">
                    <span>
                      <span className="block text-xl font-bold text-ink">{link.title}</span>
                      <span className="text-sm text-ink-soft">{link.desc}</span>
                    </span>
                    <ArrowRight size={20} className="shrink-0 text-ink transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-80 overflow-hidden rounded-[32px] md:h-[480px]">
            <Image src={visual.image} alt={visual.alt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        </section>

        {mentors.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 pb-16">
            <div className="stitch mb-14 text-ink/15" />
            <SectionHeading
              size="card"
              title="Mentors who made the move"
              action={<ArrowLink href="/mentors?category=study-abroad">See all {preview?.total}</ArrowLink>}
              className="mb-8"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {mentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={fromCategoryPreview(mentor)} viewer={{ kind: "preview" }} />
              ))}
            </div>
          </section>
        )}

        <ScholarshipsPreview />
        <CountriesPreview />
      </main>

      <Footer />
    </>
  );
}
