import SectionHeading from "@/components/ui/SectionHeading";
/**
 * Three steps as big numerals on hairline rules — no icons. The copy
 * describes what Agaaw actually does (manual bKash/bank payments held until
 * the student confirms), not generic marketing.
 */
const STEPS = [
  {
    title: "Tell us where you're headed",
    body: "Your target countries, subject and intake. We show the mentors and scholarships that fit.",
  },
  {
    title: "Choose someone who's done it",
    body: "Read where they studied and how they got in, then send a short request.",
  },
  {
    title: "Talk, then pay safely",
    body: "Message and video-call inside Agaaw. Pay by bKash or bank — we hold it until you confirm the work is done.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-paper-deep">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <SectionHeading eyebrow="No agencies, no middlemen" title="How Agaaw works" />

        <ol className="divide-y-2 divide-ink/10 border-y-2 border-ink/10">
          {STEPS.map((step, i) => (
            <li key={step.title} className="grid grid-cols-[4.5rem_1fr] gap-4 py-8 sm:grid-cols-[6rem_1fr]">
              <span className="text-5xl font-extrabold leading-none tracking-tight text-elm sm:text-6xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-2xl font-bold tracking-[-0.02em] text-ink">{step.title}</h3>
                <p className="mt-2 max-w-lg leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
