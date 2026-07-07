export interface ProfileCompletionResult {
  percentage: number;
  missingItems: string[];
}

export function calculateMentorProfileCompletion(
  profile: any,
  documents: any[] = []
): ProfileCompletionResult {
  if (!profile) {
    return {
      percentage: 0,
      missingItems: ["Complete your basic profile details"],
    };
  }

  let percentage = 0;
  const missingItems: string[] = [];

  // 1. Basic Info & Bio (+15%)
  if (profile.bio && typeof profile.bio === "string" && profile.bio.trim().length > 5) {
    percentage += 15;
  } else {
    missingItems.push("Add Bio / About Me description");
  }

  // 2. Academic Details (+15%)
  const hasUniversity = profile.currentUniversity && profile.currentUniversity.trim().length > 0;
  const hasSubjectOrDegree =
    (profile.subject && profile.subject.trim().length > 0) ||
    (profile.degree && profile.degree.trim().length > 0);

  if (hasUniversity && hasSubjectOrDegree) {
    percentage += 15;
  } else {
    missingItems.push("Add University & Studying Department");
  }

  // 3. Contact Phone (+10%)
  if (profile.phone && typeof profile.phone === "string" && profile.phone.trim().length > 3) {
    percentage += 10;
  } else {
    missingItems.push("Add Contact Phone Number");
  }

  // 4. Location (+10%)
  const hasLocation =
    (profile.countryName && profile.countryName.trim().length > 0) ||
    (profile.cityName && profile.cityName.trim().length > 0);

  if (hasLocation) {
    percentage += 10;
  } else {
    missingItems.push("Add Location (Country / City)");
  }

  // 5. Languages & Expertise (+10%)
  const hasLanguages = Array.isArray(profile.languages) && profile.languages.length > 0;
  const hasExpertise =
    (Array.isArray(profile.expertiseTags) && profile.expertiseTags.length > 0) ||
    (Array.isArray(profile.expertise) && profile.expertise.length > 0);

  if (hasLanguages || hasExpertise) {
    percentage += 10;
  } else {
    missingItems.push("Add Languages or Expertise Tags");
  }

  // 6. Mentorship Services (+15%)
  if (Array.isArray(profile.services) && profile.services.length > 0) {
    percentage += 15;
  } else {
    missingItems.push("Configure Mentorship Services & Pricing");
  }

  // 7. Required Documents (+25%)
  const docsList = Array.isArray(documents) ? documents : [];
  const hasIdCard = docsList.some((d) => d.type === "certificate");
  const hasPassportOrVisa = docsList.some((d) => d.type === "transcript" || d.type === "other");

  if (hasIdCard && hasPassportOrVisa) {
    percentage += 25;
  } else if (hasIdCard && !hasPassportOrVisa) {
    percentage += 10;
    missingItems.push("Upload Required Document: Passport or Visa");
  } else if (!hasIdCard && hasPassportOrVisa) {
    percentage += 15;
    missingItems.push("Upload Required Document: Student ID Card");
  } else {
    missingItems.push("Upload Required Documents: Student ID Card, Passport / Visa");
  }

  // Cap at 100
  percentage = Math.min(100, Math.round(percentage));

  return { percentage, missingItems };
}
