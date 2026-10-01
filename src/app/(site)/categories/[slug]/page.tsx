import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import MentorPreviewCard from "@/components/categories/MentorPreviewCard";
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
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.98] tracking-[-0.035em] text-ink md:text-6xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">{category.description}</p>
            )}
            {category.isActive ? (
              <p className="mt-8 inline-flex items-center rounded-full px-4 py-2 text-sm font-bold text-ink" style={{ backgroundColor: visual.accent }}>
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
            <Empty title="We're getting this category ready" body="Mentors can't join it yet. Check back soon." />
          ) : mentors.length === 0 ? (
            <Empty
              title="Be one of the first mentors here"
              body={`Students are looking for help with ${category.name.toLowerCase()}. If you've done it, you can guide them.`}
              cta={{ href: "/register/mentor", label: "Become a mentor" }}
            />
          ) : (
            <>
              <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <h2 className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink">Meet the mentors</h2>
                <p className="text-sm text-ink-soft">Open a profile to see what they offer and their prices.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {mentors.map((mentor) => (
                  <MentorPreviewCard key={mentor.id} mentor={mentor} />
                ))}
              </div>

              <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-[28px] bg-ink px-8 py-8 text-paper sm:flex-row sm:items-center">
                <p className="font-display text-2xl font-bold tracking-[-0.02em]">
                  {total > mentors.length ? `See all ${total} mentors and filter by country` : "Ready to talk to one of them?"}
                </p>
                <Link
                  href={`/mentors?category=${category.slug}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-marigold px-6 py-3 font-semibold text-ink transition-colors hover:bg-paper"
                >
                  Find your mentor <ArrowRight size={18} />
                </Link>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

function Empty({ title, body, cta }: { title: string; body: string; cta?: { href: string; label: string } }) {
  return (
    <div className="rounded-[28px] border-2 border-dashed border-ink/15 px-6 py-16 text-center">
      <p className="font-hand text-3xl text-brick">nothing here yet</p>
      <h2 className="mt-2 font-display text-2xl font-bold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-ink-soft">{body}</p>
      {cta && (
        <Link href={cta.href} className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-paper hover:bg-forest">
          {cta.label} <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}
