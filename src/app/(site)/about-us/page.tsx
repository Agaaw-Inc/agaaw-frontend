import type { Metadata } from "next";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import SectionHeading from "@/components/ui/SectionHeading";
import Eyebrow from "@/components/ui/Eyebrow";
import PortraitCard from "@/components/ui/PortraitCard";
import { ButtonLink } from "@/components/ui/Button";
import { getCategories } from "@/lib/categories";
import { getApprovedMentorCount, getClosingSoonScholarships, getCountryCount, getPlatformPricing } from "@/lib/homeData";

export const metadata: Metadata = {
  title: "About Agaaw — mentorship from people who've done it",
  description:
    "Agaaw connects people in Bangladesh with mentors who have already studied abroad, built careers, started businesses and published research. Real people, prices agreed upfront, money protected until the work is done.",
};

/** Real Agaaw people. Update captions here if anyone's details change. */
const PEOPLE = [
  { name: "Mahamudul Hasan Fuad", caption: "Mentor · Texas State University", image: "/mentors/fuad.JPG", tilt: "-rotate-6 translate-y-6" },
  { name: "Omar Faruk", caption: "Agaaw team", image: "/images/omar.jpg", tilt: "z-10 -translate-y-2" },
  { name: "Maynuddin Tuhin Joy", caption: "Mentor · Japan", image: "/mentors/joy.JPG", tilt: "rotate-6 translate-y-8" },
];

const TRUST = [
  {
    title: "People are checked by people",
    body: "Every mentor is approved by our team before students can find them, and can verify their identity with an ID card and a university or work email.",
  },
  {
    title: "Private stays private",
    body: "Mentors' phone numbers and ID documents are visible only to Agaaw admins — never to students, never in the public directory.",
  },
  {
    title: "Your money waits for the work",
    body: "Students pay Agaaw, not the mentor. We hold the payment until the student confirms the work is done, or the review window ends.",
  },
  {
    title: "A human settles disputes",
    body: "If something goes wrong, our team reviews it and can refund the student, release the payment, or send the work back for a revision.",
  },
  {
    title: "Reviews you can believe",
    body: "Only students who have actually worked with a mentor can review them.",
  },
];

export default async function AboutPage() {
  const [categories, mentorCount, scholarships, countryCount, pricing] = await Promise.all([
    getCategories(),
    getApprovedMentorCount(),
    getClosingSoonScholarships(0),
    getCountryCount(),
    getPlatformPricing(),
  ]);

  const openCategories = categories.filter((c) => c.isActive);
  const upcoming = categories.filter((c) => !c.isActive);

  // Pricing comes from the API, never hard-coded — fall back to plain words.
  const feePct = pricing ? Math.round(pricing.commissionRate * 100) : null;
  const reviewDays = pricing ? Math.round(pricing.disputeWindowHours / 24) : null;
  const minPayout = pricing ? `৳${Number(pricing.minPayout).toLocaleString("en-US")}` : null;

  // Only numbers we can stand behind, and only when they're not zero.
  const numbers = [
    { label: "Approved mentors", value: mentorCount },
    { label: "Areas of mentorship", value: openCategories.length },
    { label: "Scholarships listed", value: scholarships.total },
    { label: "Country guides", value: countryCount },
  ].filter((n) => n.value > 0);

  const audiences = [
    {
      who: "For students",
      title: "Ask before you spend.",
      points: [
        "Browsing mentors, scholarships and guides is free.",
        "See where a mentor studied or worked, and what other students say about them.",
        reviewDays
          ? `Your payment is held by Agaaw and released only when you confirm the work — or after ${reviewDays} days if you raise nothing.`
          : "Your payment is held by Agaaw and released only when you confirm the work is done.",
      ],
      cta: { href: "/register/student", label: "Create a free account" },
    },
    {
      who: "For mentors",
      title: "Get paid for what you already know.",
      points: [
        "Write your own services and set your own prices in taka.",
        feePct !== null
          ? `Keep ${100 - feePct}% of every order. Agaaw's fee is ${feePct}%, and only on work that's completed.`
          : "Keep most of every order — Agaaw takes a small fee only on completed work.",
        minPayout ? `Withdraw to bKash, Nagad or your bank once you've earned ${minPayout}.` : "Withdraw to bKash, Nagad or your bank.",
      ],
      cta: { href: "/register/mentor", label: "Become a mentor" },
    },
    {
      who: "For partners and investors",
      title: "A trust layer for advice in Bangladesh.",
      points: [
        feePct !== null
          ? `A marketplace model: a ${feePct}% fee on completed orders, earned only when the student is satisfied.`
          : "A marketplace model: a fee on completed orders, earned only when the student is satisfied.",
        `Not tied to one field — ${openCategories.map((c) => c.name.toLowerCase()).join(", ")} today${upcoming.length ? `, ${upcoming.map((c) => c.name.toLowerCase()).join(", ")} next` : ""}.`,
        "Trust built in: identity checks, admin-verified payments and a human-run dispute process.",
      ],
      cta: { href: "mailto:support@agaaw.com?subject=Partnership%20with%20Agaaw", label: "Talk to us" },
    },
  ];

  return (
    <>
      <MainNavbar />

      <main className="bg-paper">
        {/* ── Hero ── */}
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-14 md:pt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div>
            <SectionHeading
              size="display"
              eyebrow="About Agaaw"
              title="Every next step has been taken by someone. We help you find them."
              description="Agaaw began as a way for students in Bangladesh to get honest advice about studying abroad from people already living it. Today it does the same for careers, business and research — real mentors, real experience, paid fairly and safely."
            />
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/mentors" size="lg">
                Find a mentor
              </ButtonLink>
              <ButtonLink href="/register/mentor" variant="outline" size="lg">
                Become a mentor
              </ButtonLink>
            </div>
          </div>

          <div className="relative mx-auto flex h-[340px] items-center justify-center">
            {PEOPLE.map((person) => (
              <PortraitCard
                key={person.name}
                name={person.name}
                caption={person.caption}
                image={person.image}
                className={`-mx-4 ${person.tilt}`}
              />
            ))}
          </div>
        </section>

        <div className="stitch mx-auto max-w-7xl text-ink/15" />

        {/* ── Story ── */}
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <SectionHeading eyebrow="Why we started" title="Guidance shouldn't be a luxury." />
          <div className="space-y-6 text-lg leading-relaxed text-ink-soft">
            <p>
              For years, studying abroad from Bangladesh meant trusting an agency: high fees, vague promises, and advice from
              people who had never made the trip themselves. We met students who lost their savings to advisors who simply
              disappeared.
            </p>
            <p>
              So we built the obvious alternative. The people who have actually done it — the student who won the
              scholarship, the graduate who landed the job — guide the people who are about to. No middlemen. Prices agreed
              upfront. Money protected until the work is done.
            </p>
            <p className="text-ink">
              Then students started asking the same mentors about their CV, their first job, their research paper, their
              small business. That&apos;s why Agaaw is no longer only about studying abroad.
            </p>
          </div>
        </section>

        {/* ── Numbers (live) ── */}
        {numbers.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 pb-20">
            <dl className="grid grid-cols-2 gap-y-8 border-y-2 border-ink/10 py-8 md:grid-cols-4">
              {numbers.map((n) => (
                <div key={n.label} className="border-l-2 border-ink/10 pl-5">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{n.label}</dt>
                  <dd className="mt-1 text-4xl font-extrabold tracking-tight text-ink md:text-5xl">{n.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* ── What Agaaw covers (the same section as the homepage) ── */}
        <CategoryShowcase categories={categories} />

        {/* ── Who it's for ── */}
        <section className="bg-paper-deep">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
            <SectionHeading eyebrow="Who it's for" title="Built for three kinds of people." className="mb-14" />
            <div className="grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x-2 md:divide-ink/10">
              {audiences.map((a, i) => (
                <div key={a.who} className={i === 0 ? "md:pr-10" : i === 1 ? "md:px-10" : "md:pl-10"}>
                  <Eyebrow tone={i === 2 ? "maroon" : "brand"}>{a.who}</Eyebrow>
                  <h3 className="mt-3 text-2xl font-extrabold leading-tight tracking-[-0.02em] text-ink">{a.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {a.points.map((point) => (
                      <li key={point} className="border-t border-ink/10 pt-3 text-ink-soft">
                        {point}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href={a.cta.href} variant={i === 2 ? "outline" : "primary"} size="sm" className="mt-6">
                    {a.cta.label}
                  </ButtonLink>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust ── */}
        <section className="bg-forest text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <SectionHeading
              tone="light"
              eyebrow="Trust and safety"
              title="How we keep it honest."
              description="Advice is only worth paying for if you can trust who's giving it. These rules are built into the product, not written in a policy nobody reads."
            />
            <ol className="divide-y divide-white/15 border-y border-white/15">
              {TRUST.map((item, i) => (
                <li key={item.title} className="grid grid-cols-[3rem_1fr] gap-4 py-6">
                  <span className="text-2xl font-extrabold text-seagreen">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-lg font-bold">{item.title}</p>
                    <p className="mt-1 text-white/70">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Where we're going ── */}
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <SectionHeading eyebrow="Where we're going" title="The place you ask someone who's done it." />
          <div className="space-y-6 text-lg leading-relaxed text-ink-soft">
            <p>
              {upcoming.length > 0
                ? `${upcoming.map((c) => c.name).join(" and ")} opens next, and new areas follow as experienced mentors join.`
                : "New areas open as experienced mentors join."}{" "}
              The rule stays the same in every one: real people, real experience, prices agreed upfront, money protected.
            </p>
            <p>
              If you&apos;ve walked a path others are about to start — a degree abroad, a career switch, a first business, a
              published paper — there&apos;s someone on Agaaw who needs exactly what you know.
            </p>
          </div>
        </section>

        {/* ── Closing call ── */}
        <section className="mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] bg-ink px-8 py-12 text-white md:flex-row md:items-center md:px-14">
            <SectionHeading tone="light" size="card" title="Your next step is someone else's last one." className="max-w-xl" />
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/mentors" variant="light">
                Find a mentor
              </ButtonLink>
              <ButtonLink href="/register/mentor" variant="outline" className="border-white/40 text-white hover:border-white">
                Become a mentor
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
