/**
 * The photograph and accent colour for each category. Photos are real
 * Unsplash photographs (free licence, no attribution required), served
 * through next/image so they're resized and cached by our own server.
 *
 * Keyed by slug. A category added to the database later without an entry
 * here still renders — it falls back to FALLBACK_VISUAL.
 */

export interface CategoryVisual {
  image: string;
  /** Describes the photo for screen readers — not the category name. */
  alt: string;
  /** Palette colour for the bar on the label tab (seagreen, dark green, maroon, grey). */
  accent: string;
  /** Short human line under the name on photo cards. */
  tagline: string;
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=75`;

export const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  "study-abroad": {
    image: unsplash("1629308993023-bb7ca078abdc"),
    alt: "Travellers collecting luggage in an airport arrivals hall abroad",
    accent: "#1d7a85",
    tagline: "Scholarships, applications, visas — from students already there.",
  },
  career: {
    image: unsplash("1621857768404-fc6a3babee48"),
    alt: "A young professional working on a laptop in a bright office",
    accent: "#12332f",
    tagline: "CVs, interviews and your first real job.",
  },
  business: {
    image: unsplash("1753184863498-72e77c60888b"),
    alt: "A small neighbourhood shop stocked with colourful snack packets",
    accent: "#5e1820",
    tagline: "From a first shop to a funded startup.",
  },
  "research-publication": {
    image: unsplash("1618053448492-2b629c2c912c"),
    alt: "A young researcher holding a sample in a bright laboratory",
    accent: "#227a60",
    tagline: "Proposals, papers and getting through peer review.",
  },
  legal: {
    image: unsplash("1589829545856-d10d557cf95f"),
    alt: "A bronze statue of Lady Justice holding scales",
    accent: "#9ca3a0",
    tagline: "Everyday legal questions, answered by professionals.",
  },
};

export const FALLBACK_VISUAL: CategoryVisual = {
  image: unsplash("1524995997946-a1c2e315a42f"),
  alt: "Shelves of books curving around a library",
  accent: "#9ca3a0",
  tagline: "Guidance from people who have done it.",
};

export function visualFor(slug: string): CategoryVisual {
  return CATEGORY_VISUALS[slug] ?? FALLBACK_VISUAL;
}
