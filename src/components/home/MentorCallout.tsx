import PortraitCard from "@/components/ui/PortraitCard";
import { ButtonLink } from "@/components/ui/Button";
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
              description="Guide students through applications, scholarships and visas — the road you've already travelled. Set your own services and prices, and we handle the payments."
            />
            <ButtonLink href="/register/mentor" variant="light" className="mt-8">
              Become a mentor <ArrowRight size={18} />
            </ButtonLink>
          </div>

          <div className="relative mx-auto flex h-[280px] items-center justify-center">
            {FACES.map((face) => (
              <PortraitCard key={face.name} name={face.name} caption={face.role} image={face.image} className={`-mx-3 ${face.tilt}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
