import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Real Agaaw mentors, shown as portrait cards in the same style as
 * MentorBanner (tall rounded photo, name over a dark fade).
 */
const FACES = [
  { name: "Mahamudul Hasan Fuad", role: "Texas State University, San Marcos", image: "/mentors/fuad.JPG", tilt: "-rotate-6 translate-y-4" },
  { name: "Maynuddin Tuhin Joy", role: "Japan", image: "/mentors/joy.JPG", tilt: "rotate-3 -translate-x-6" },
];

/** "Become a mentor" — a solid dark-green block, no yellow. */
export default function MentorCallout() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="relative grid items-center gap-12 overflow-hidden rounded-[2rem] bg-forest px-8 py-12 text-white md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:px-14 md:py-16">
          <div>
            <SectionHeading
              tone="light"
              eyebrow="Been there?"
              title="Help someone get there too."
              description="Mentor in the field you know — studying abroad, careers, business or research. Write your own services, set your own prices, and we handle the payments."
            />
            <Link
              href="/register/mentor"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-ink transition-colors hover:bg-seagreen-soft"
            >
              Become a mentor <ArrowRight size={18} />
            </Link>
          </div>

          <div className="relative mx-auto flex h-[280px] items-center justify-center">
            {FACES.map((face) => (
              <div
                key={face.name}
                className={`relative -mx-3 h-[240px] w-[160px] overflow-hidden rounded-xl border border-white/10 shadow-xl ${face.tilt}`}
              >
                <Image src={face.image} alt={face.name} fill sizes="160px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="truncate text-xs text-gray-300">{face.role}</p>
                  <p className="truncate text-sm font-semibold leading-tight">{face.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
