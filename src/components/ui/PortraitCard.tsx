import Image from "next/image";
import { cn } from "@/lib/utils";

interface PortraitCardProps {
  name: string;
  /** One line under the name, e.g. a university or role. */
  caption: string;
  image: string;
  className?: string;
  sizes?: string;
}

/**
 * A real person, as a tall photo with their name over a dark fade — the
 * MentorBanner style. Used wherever Agaaw shows its own people.
 */
export default function PortraitCard({ name, caption, image, className, sizes = "180px" }: PortraitCardProps) {
  return (
    <figure className={cn("relative h-[240px] w-[160px] overflow-hidden rounded-xl border border-white/10 shadow-xl", className)}>
      <Image src={image} alt={name} fill sizes={sizes} className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <figcaption className="absolute bottom-3 left-3 right-3 text-white">
        <p className="truncate text-xs text-gray-300">{caption}</p>
        <p className="truncate text-sm font-semibold leading-tight">{name}</p>
      </figcaption>
    </figure>
  );
}
