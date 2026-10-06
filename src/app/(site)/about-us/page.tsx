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

export const metadata: Metadata = {
  title: "About Agaaw — study abroad with someone who's done it",
  description:
    "Agaaw connects students in Bangladesh with mentors who have already studied abroad, alongside scholarships and country guides, with prices agreed upfront and payments protected until the work is done.",
};

/** The story photos. Served through next/image, so they're resized and cached by our own server. */
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=75`;
const STORY_PHOTOS = [
  { image: unsplash("1524995997946-a1c2e315a42f"), alt: "Shelves of books curving around a library", caption: "Applications" },
  { image: unsplash("1629308993023-bb7ca078abdc"), alt: "Travellers collecting luggage in an airport arrivals hall abroad", caption: "Arrival" },
];

/** Real Agaaw people for the closing block. Update captions here if details change. */
const PEOPLE = [
  { name: "Mahamudul Hasan Fuad", caption: "Mentor · Texas State University", image: "/mentors/fuad.JPG", tilt: "-rotate-6 translate-y-6" },
  { name: "Omar Faruk", caption: "Agaaw team", image: "/images/omar.jpg", tilt: "z-10 -translate-y-2" },
  { name: "Maynuddin Tuhin Joy", caption: "Mentor · Japan", image: "/mentors/joy.JPG", tilt: "rotate-6 translate-y-8" },
];

const STEPS = [
  {
    title: "Discover",
    description: "Explore countries, universities and scholarships that fit your goals, your subject and your budget.",
  },
  {
    title: "Pick someone who's done it",
    description: "Read where they studied and how they got in, check their reviews, then send a request.",
  },
  {
    title: "Talk, then pay safely",
    description: "Message and video-call inside Agaaw. Pay by bKash or bank — we hold it until you confirm the work is done.",
  },
];

const PROMISES = [
  "Every mentor approved by our team",
  "No agency commissions from universities",
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
      "Students and graduates studying at universities abroad right now, with up-to-date advice — each approved by our team before anyone can find them.",
  },
  {
    title: "Everything in one place",
    description:
      "Scholarships, country guides and mentors side by side. Find a mentor, message them, book a video call, order a service and pay — without leaving Agaaw.",
  },
  {
    title: "Student-first, always",
    description:
      "We're paid by students for honest guidance, not by universities for enrolments — so the advice is about what's right for you.",
  },
];

export default function AboutPage() {
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
                  Study abroad with someone <br className="hidden md:block" />
                  <span className="text-elm">who&apos;s already done it.</span>
                </>
              }
              description="Agaaw is your all-in-one platform for studying abroad. Find scholarships and country guides, and get help from mentors who have already made the move — with prices agreed upfront, and your payment protected until the work is done."
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
                    On Agaaw, the people who have actually done it guide the people who are about to: students abroad
                    helping students at home, from choosing a university to writing the essay, winning the scholarship
                    and getting the visa. No middlemen, no hidden fees, just people who have been there.
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

              <div className="w-full lg:w-1/2">
                <div className="grid grid-cols-2 gap-4">
                  {STORY_PHOTOS.map((photo, i) => (
                    <figure
                      key={photo.caption}
                      className={`relative overflow-hidden rounded-3xl bg-paper-deep ${i % 2 === 1 ? "mt-10" : ""} aspect-[4/5]`}
                    >
                      <Image src={photo.image} alt={photo.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                      <figcaption className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-ink">
                        {photo.caption}
                      </figcaption>
                    </figure>
                  ))}
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
                  To connect every student with a dream of studying abroad directly with a mentor who has already done it,
                  and with the scholarships that make it possible — with clear prices and protected payments.
                </p>
              </Card>
              <Card padding="lg" className="rounded-[2rem] border-t-4 border-maroon">
                <Eyebrow tone="maroon">Our vision</Eyebrow>
                <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                  To become the first place students go when they plan to study abroad — starting in Bangladesh, and
                  reaching wherever our mentors are.
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
              description="We've turned the study abroad journey into three simple steps."
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
                        Ready to start <br />
                        <span className="text-seagreen">your journey?</span>
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
