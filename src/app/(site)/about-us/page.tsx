import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import Eyebrow from "@/components/ui/Eyebrow";
import Card from "@/components/ui/Card";
import PortraitCard from "@/components/ui/PortraitCard";
import { ButtonLink } from "@/components/ui/Button";
import { getCategories } from "@/lib/categories";
import { visualFor } from "@/lib/categoryVisuals";

export const metadata: Metadata = {
  title: "About Agaaw — mentorship for every next step",
  description:
    "Agaaw is an all-in-one mentorship platform: study abroad, careers, business and research, with mentors who have already done it, prices agreed upfront and payments protected until the work is done.",
};

/** Real Agaaw people for the closing block. Update captions here if details change. */
const PEOPLE = [
  { name: "Mahamudul Hasan Fuad", caption: "Mentor · Texas State University", image: "/mentors/fuad.JPG", tilt: "-rotate-6 translate-y-6" },
  { name: "Omar Faruk", caption: "Agaaw team", image: "/images/omar.jpg", tilt: "z-10 -translate-y-2" },
  { name: "Maynuddin Tuhin Joy", caption: "Mentor · Japan", image: "/mentors/joy.JPG", tilt: "rotate-6 translate-y-8" },
];

const STEPS = [
  {
    title: "Choose your area",
    description: "Studying abroad, your career, a business or research. Start with what you need, and see the mentors who work in it.",
  },
  {
    title: "Pick someone who's done it",
    description: "Read where they studied or worked, check their reviews and whether their identity is verified, then send a request.",
  },
  {
    title: "Talk, then pay safely",
    description: "Message and video-call inside Agaaw. Pay by bKash or bank — we hold it until you confirm the work is done.",
  },
];

const PROMISES = [
  "Every mentor approved by our team",
  "Identity checks with ID and a work or university email",
  "Prices agreed upfront, in taka",
  "Your payment held until you confirm the work",
];

const DIFFERENCES = [
  {
    title: "Clear prices, protected payments",
    description:
      "Mentors list their services and prices before you order. You pay Agaaw, not the mentor, and the money is only released when you confirm the work is done.",
  },
  {
    title: "Mentors who've done it",
    description:
      "Students and graduates who studied abroad, working professionals, founders and researchers — each approved by our team before anyone can find them.",
  },
  {
    title: "Everything in one place",
    description:
      "Find a mentor, message them, book a video call, order a service and pay. For study abroad, scholarships and country guides are right there too.",
  },
  {
    title: "Many areas, one standard",
    description:
      "Study abroad, careers, business and research today, with more opening as experienced mentors join. The same rules apply in every one of them.",
  },
];

export default async function AboutPage() {
  // The story image shows the real areas Agaaw covers, from the database.
  const categories = (await getCategories()).filter((c) => c.isActive).slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-paper selection:bg-elm/20">
      <MainNavbar />

      <main className="flex-grow">
        {/* HERO */}
        <section className="pb-20 pt-16 lg:pb-32 lg:pt-14">
          <div className="container mx-auto px-6">
            <SectionHeading
              align="center"
              size="section"
              as="h1"
              eyebrow="About Agaaw"
              title={
                <>
                  Mentorship for every next step, <br className="hidden md:block" />
                  <span className="text-elm">from people who&apos;ve taken it.</span>
                </>
              }
              description="Agaaw is an all-in-one mentorship platform. Study abroad, build your career, start a business or publish your research — with mentors who have already done it, prices agreed upfront, and your payment protected until the work is done."
            />

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href="/mentors" variant="brand" size="lg">
                Find a mentor
              </ButtonLink>
              <ButtonLink href="/register/mentor" variant="ghost" size="lg">
                Become a mentor <ArrowRight className="h-5 w-5" />
              </ButtonLink>
            </div>

            {/* VIDEO */}
            <div className="relative mx-auto mt-16 max-w-5xl px-4">
              <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-xl">
                <video src="/videos/about-us.mp4" autoPlay loop muted playsInline className="h-full w-full rounded-[2rem] object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* OUR STORY */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center gap-16 lg:flex-row">
              <div className="space-y-8 lg:w-1/2">
                <SectionHeading
                  eyebrow="Our story"
                  title={
                    <>
                      Built from a simple realization: <br />
                      <span className="text-elm">guidance shouldn&apos;t be a luxury.</span>
                    </>
                  }
                />

                <div className="space-y-6 text-lg leading-relaxed text-ink-soft">
                  <p>
                    Studying abroad from Bangladesh used to mean trusting an agency: high fees, vague promises, and advice
                    from people who had never made the trip themselves. We met students who lost their savings to advisors
                    who simply disappeared.
                  </p>
                  <p className="font-medium text-ink">So we built the obvious alternative.</p>
                  <p>
                    On Agaaw, the people who have actually done it guide the people who are about to. It started with
                    students abroad helping students at home. Then those same students asked for help with their CV, their
                    first job, their research paper, their small business — so today Agaaw covers all of it. No middlemen,
                    no hidden fees, just people who have been there.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <Card>
                    <p className="mb-1 text-sm font-bold text-ink">No agencies</p>
                    <p className="text-sm text-ink-soft">No middlemen and no hidden fees — you deal with the mentor directly.</p>
                  </Card>
                  <Card>
                    <p className="mb-1 text-sm font-bold text-ink">Direct access</p>
                    <p className="text-sm text-ink-soft">Talk to the person who actually did the thing you&apos;re trying to do.</p>
                  </Card>
                </div>
              </div>

              {/* The areas Agaaw covers, as real photographs */}
              <div className="w-full lg:w-1/2">
                <div className="grid grid-cols-2 gap-4">
                  {categories.map((category, i) => {
                    const visual = visualFor(category.slug);
                    return (
                      <figure
                        key={category.id}
                        className={`relative overflow-hidden rounded-3xl bg-paper-deep ${i % 2 === 1 ? "mt-10" : ""} aspect-[4/5]`}
                      >
                        <Image src={visual.image} alt={visual.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                        <figcaption className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-ink">
                          {category.name}
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <SectionHeading
              align="center"
              title={
                <>
                  Good guidance, <br />
                  <span className="text-elm">for everyone who asks.</span>
                </>
              }
              description="No one should be held back by who they know or where they live."
              className="mb-16"
            />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Card padding="lg" className="rounded-[2rem] border-t-4 border-elm">
                <Eyebrow>Our mission</Eyebrow>
                <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                  To connect anyone with an ambition — studying abroad, a first job, a new business, a research paper — directly
                  with a mentor who has already done it, with clear prices and protected payments.
                </p>
              </Card>
              <Card padding="lg" className="rounded-[2rem] border-t-4 border-maroon">
                <Eyebrow tone="maroon">Our vision</Eyebrow>
                <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                  To become the first place people go when they need advice from someone who&apos;s been there — starting in
                  Bangladesh, and reaching wherever our mentors are.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-ink py-24 text-white">
          <div className="container mx-auto px-6">
            <SectionHeading
              align="center"
              tone="light"
              title="Simple, transparent, safe."
              description="Whatever you need help with, it works the same way."
              className="mb-20"
            />

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {STEPS.map((step, idx) => (
                <div key={step.title} className="relative flex flex-col items-center text-center">
                  <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-white/15 text-2xl font-extrabold">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">{step.title}</h3>
                  <p className="leading-relaxed text-white/70">{step.description}</p>
                  {idx < STEPS.length - 1 && <div className="absolute left-[70%] top-10 hidden h-px w-full bg-white/15 md:block" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY AGAAW IS DIFFERENT */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="flex flex-col gap-16 lg:flex-row">
              <div className="lg:w-1/3">
                <SectionHeading
                  eyebrow="Why us"
                  title="The trust gap ends here."
                  description="We didn't build another agency. We built a place where the people who've done it are paid fairly to help the people who are about to."
                  className="mb-8"
                />
                <ul className="space-y-4">
                  {PROMISES.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-elm" />
                      <span className="font-medium text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:w-2/3">
                {DIFFERENCES.map((item, i) => (
                  <Card key={item.title} padding="lg" interactive className="rounded-3xl">
                    <p className="text-sm font-extrabold text-elm">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mb-3 mt-2 text-xl font-bold text-ink">{item.title}</h3>
                    <p className="text-ink-soft">{item.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="overflow-hidden py-24">
          <div className="container mx-auto px-6">
            <div className="rounded-[3rem] bg-forest p-10 text-white lg:p-20">
              <div className="flex flex-col items-center gap-16 lg:flex-row">
                <div className="text-center lg:w-1/2 lg:text-left">
                  <SectionHeading
                    tone="light"
                    title={
                      <>
                        Ready to take <br />
                        <span className="text-seagreen">your next step?</span>
                      </>
                    }
                    description="Create a free account to find a mentor, or share what you know as one. You only pay when you order a service."
                  />
                  <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                    <ButtonLink href="/register/student" variant="light" size="lg" className="w-full whitespace-nowrap sm:w-auto">
                      Join as a student
                    </ButtonLink>
                    <ButtonLink
                      href="/register/mentor"
                      variant="outline"
                      size="lg"
                      className="w-full whitespace-nowrap border-white/30 text-white hover:border-white sm:w-auto"
                    >
                      Become a mentor <ArrowRight className="h-5 w-5" />
                    </ButtonLink>
                  </div>
                </div>

                {/* Real people instead of an illustration */}
                <div className="flex h-[320px] items-center justify-center lg:w-1/2">
                  {PEOPLE.map((person) => (
                    <PortraitCard key={person.name} name={person.name} caption={person.caption} image={person.image} className={`-mx-4 ${person.tilt}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
