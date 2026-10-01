import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** A solid marigold block — Kollegio-style colour, not a gradient banner. */
export default function MentorCallout() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="relative grid items-center gap-10 overflow-hidden rounded-[36px] bg-marigold px-8 py-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:px-14 md:py-16">
          <div>
            <p className="font-hand text-2xl text-ink/70">been there?</p>
            <h2 className="mt-1 font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] text-ink md:text-5xl">
              Help someone get there too.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/80">
              Mentor in the field you know — studying abroad, careers, business or research. Write your own services, set your
              own prices, and we handle the payments.
            </p>
            <Link
              href="/register/mentor"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-paper transition-colors hover:bg-forest"
            >
              Become a mentor <ArrowRight size={18} />
            </Link>
          </div>

          <figure className="relative mx-auto w-56 rotate-3 bg-white p-3 pb-4 shadow-[0_18px_40px_-12px_rgba(23,33,30,0.4)] md:w-64">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/images/omar.jpg" alt="Omar from the Agaaw team" fill sizes="256px" className="object-cover" />
            </div>
            <figcaption className="mt-3 font-hand text-2xl leading-none text-ink">
              Omar <span className="text-ink-soft">· Agaaw team</span>
            </figcaption>
          </figure>

          <div className="stitch absolute bottom-6 left-8 right-8 text-ink/20 md:left-14 md:right-14" />
        </div>
      </div>
    </section>
  );
}
