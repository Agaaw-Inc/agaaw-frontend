/**
 * The API returns mentors in three shapes (the student directory, the public
 * directory, and a category preview). MentorCard takes one shape; these
 * functions convert each source into it, so no page writes its own mapping.
 */

import type { CategoryMentorPreview, MentorRating, PublicMentorCard } from "./categories";

export interface MentorCardData {
  id: string;
  name: string;
  image: string | null;
  university: string | null;
  country: string | null;
  subject: string | null;
  expertise: string[];
  categories: { slug: string; name: string }[];
  identityVerified: boolean;
  rating: MentorRating;
}

const NO_RATING: MentorRating = { average: null, count: 0 };

/** The student list says "Not specified" for empty fields; treat that as empty. */
const real = (v: string | null | undefined) => (v && v !== "Not specified" ? v : null);

/** GET /users/mentors/directory (public) */
export function fromPublicCard(m: PublicMentorCard): MentorCardData {
  return {
    id: m.id,
    name: `${m.firstName} ${m.lastName}`.trim(),
    image: m.profileImage,
    university: m.currentUniversity,
    country: m.countryName,
    subject: m.subject,
    expertise: m.expertise,
    categories: m.categories,
    identityVerified: m.identityVerified,
    rating: m.rating,
  };
}

/** GET /users/mentors (students) — untyped in lib/api, so typed loosely here. */
export function fromStudentList(m: {
  id: string;
  name: string;
  image?: string | null;
  university?: string | null;
  country?: string | null;
  expertise?: string[];
  categories?: { slug: string; name: string }[];
  identityVerified?: boolean;
  rating?: MentorRating;
}): MentorCardData {
  return {
    id: m.id,
    name: m.name,
    image: m.image ?? null,
    university: real(m.university),
    country: real(m.country),
    subject: null,
    expertise: m.expertise ?? [],
    categories: m.categories ?? [],
    identityVerified: !!m.identityVerified,
    rating: m.rating ?? NO_RATING,
  };
}

/** GET /categories/:slug/mentors */
export function fromCategoryPreview(m: CategoryMentorPreview): MentorCardData {
  return {
    id: m.id,
    name: `${m.firstName} ${m.lastName}`.trim(),
    image: m.profileImage,
    university: m.currentUniversity,
    country: m.countryName,
    subject: m.subject,
    expertise: [],
    categories: [],
    identityVerified: m.identityVerified,
    rating: NO_RATING,
  };
}
