/**
 * Three steps as big numerals on hairline rules — no icons. The copy
 * describes what Agaaw actually does (manual bKash/bank payments held until
 * the student confirms), not generic marketing.
 */
const STEPS = [
  {
    title: "Pick what you need",
    body: "Studying abroad, your career, a business, or research. Start with the area, not a search box.",
  },
  {
    title: "Choose someone who's done it",
    body: "Read where they studied or worked, see if their identity is verified, and send a short request.",
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
        <div>
          <p className="font-hand text-2xl text-maroon">no agencies, no middlemen</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] text-ink md:text-5xl">
            How Agaaw works
          </h2>
        </div>

        <ol className="divide-y-2 divide-ink/10 border-y-2 border-ink/10">
          {STEPS.map((step, i) => (
            <li key={step.title} className="grid grid-cols-[4.5rem_1fr] gap-4 py-8 sm:grid-cols-[6rem_1fr]">
              <span className="font-display text-5xl font-extrabold leading-none tracking-tight text-elm sm:text-6xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">{step.title}</h3>
                <p className="mt-2 max-w-lg leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
