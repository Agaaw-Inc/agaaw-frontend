/**
 * MentorCard takes one shape; this converts the API's mentor list into it,
 * so no page writes its own mapping.
 */

export interface MentorCardData {
  id: string;
  name: string;
  image: string | null;
  university: string | null;
  country: string | null;
  expertise: string[];
}

/** The student list says "Not specified" for empty fields; treat that as empty. */
const real = (v: string | null | undefined) => (v && v !== "Not specified" ? v : null);

/** GET /users/mentors (students) — untyped in lib/api, so typed loosely here. */
export function fromStudentList(m: {
  id: string;
  name: string;
  image?: string | null;
  university?: string | null;
  country?: string | null;
  expertise?: string[];
}): MentorCardData {
  return {
    id: m.id,
    name: m.name,
    image: m.image ?? null,
    university: real(m.university),
    country: real(m.country),
    expertise: m.expertise ?? [],
  };
}
