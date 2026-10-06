import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONES = {
  brand: "text-elm",
  maroon: "text-maroon",
  muted: "text-ink-soft",
  /** for dark backgrounds */
  light: "text-seagreen",
};

/** The small uppercase label that sits above a heading. */
export default function Eyebrow({ children, tone = "brand", className }: { children: ReactNode; tone?: keyof typeof TONES; className?: string }) {
  return <p className={cn("text-xs font-bold uppercase tracking-[0.18em]", TONES[tone], className)}>{children}</p>;
}
