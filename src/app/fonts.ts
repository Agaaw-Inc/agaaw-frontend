import { Bricolage_Grotesque, Inter, Kalam } from "next/font/google";

/** Body text — unchanged, so every existing page keeps its look. */
export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

/**
 * Headlines on the redesigned pages. A grotesque with irregular, slightly
 * hand-cut letterforms — reads as designed by a person, not a template.
 */
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-bricolage",
});

/**
 * Handwritten notes: polaroid captions and margin scribbles. Use sparingly.
 * Kalam was designed in India — a handwriting that feels local here.
 * (Caveat was tried first, but Turbopack's dev server can't load it.)
 */
export const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kalam",
});
