import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import MentorCard from "@/components/mentors/MentorCard";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeading from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { fromCategoryPreview } from "@/lib/mentorCards";
import { getCategoryBySlug, getCategoryMentors } from "@/lib/categories";
import { visualFor } from "@/lib/categoryVisuals";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) return { title: "Category not found | Agaaw" };
  return {
    title: `${category.name} mentors | Agaaw`,
    description: category.description ?? undefined,
  };
}

/**
 * One category: who mentors here. Students find a mentor by category, then
 * see that mentor's services on their profile — services are never listed
 * on their own. Study abroad has a richer page, so it redirects there.
 */
export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug === "study-abroad") redirect("/study-abroad");

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const visual = visualFor(category.slug);
  const preview = category.isActive ? await getCategoryMentors(slug) : null;
  const mentors = preview?.mentors ?? [];
  const total = preview?.total ?? 0;

  return (
    <>
      <MainNavbar />

      <main className="bg-paper">
        {/* Header: words left, photograph right */}
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-14 pt-12 md:pt-16 lg:grid-cols-2">
          <div>
            <Link href="/#categories" className="text-sm font-semibold text-ink-soft hover:text-ink">
              ← All categories
            </Link>
            <SectionHeading
              size="display"
              title={category.name}
              description={category.description ?? undefined}
              className="mt-6"
            />
            {category.isActive ? (
              <p className="mt-8 inline-flex items-center rounded-full px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: visual.accent }}>
                {total === 0 ? "Mentors are joining now" : `${total} mentor${total === 1 ? "" : "s"} ready to help`}
              </p>
            ) : (
              <p className="mt-8 inline-flex items-center rounded-full bg-ink/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-ink-soft">
                Coming soon
              </p>
            )}
          </div>

          <div className={`relative h-72 overflow-hidden rounded-[32px] md:h-[380px] ${category.isActive ? "" : "grayscale"}`}>
            <Image src={visual.image} alt={visual.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </section>

        <div className="stitch mx-auto max-w-7xl text-ink/15" />

        {/* Mentors */}
        <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          {!category.isActive ? (
            <EmptyState title="We're getting this category ready" body="Mentors can't join it yet. Check back soon." />
          ) : mentors.length === 0 ? (
            <EmptyState
              title="Be one of the first mentors here"
              body={`Students are looking for help with ${category.name.toLowerCase()}. If you've done it, you can guide them.`}
              action={{ href: "/register/mentor", label: "Become a mentor" }}
            />
          ) : (
            <>
              <SectionHeading
                size="card"
                title="Meet the mentors"
                description="Open a profile to see what they offer and their prices."
                className="mb-8"
              />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {mentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={fromCategoryPreview(mentor)} viewer={{ kind: "preview" }} />
                ))}
              </div>

              <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-[28px] bg-ink px-8 py-8 text-paper sm:flex-row sm:items-center">
                <p className="text-2xl font-bold tracking-[-0.02em]">
                  {total > mentors.length ? `See all ${total} mentors and filter by country` : "Ready to talk to one of them?"}
                </p>
                <ButtonLink href={`/mentors?category=${category.slug}`} variant="light" className="shrink-0">
                  Find your mentor <ArrowRight size={18} />
                </ButtonLink>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
