import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import HomeHero from "@/components/home/HomeHero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import HowItWorks from "@/components/home/HowItWorks";
import StudyAbroadBand from "@/components/home/StudyAbroadBand";
import MentorCallout from "@/components/home/MentorCallout";
import { getCategories } from "@/lib/categories";
import { getApprovedMentorCount, getClosingSoonScholarships, getCountryCount } from "@/lib/homeData";

/**
 * Agaaw as a multi-category mentorship platform. A server component: all
 * data is fetched at build time and refreshed every 5 minutes, so the page
 * is served pre-built and fast, with no loading spinners.
 */
export default async function HomePage() {
  const [categories, mentorCount, closingSoon, countryCount] = await Promise.all([
    getCategories(),
    getApprovedMentorCount(),
    getClosingSoonScholarships(4),
    getCountryCount(),
  ]);

  return (
    <>
      <MainNavbar />
      <main className="bg-paper">
        <HomeHero categories={categories} mentorCount={mentorCount} scholarshipCount={closingSoon.total} />
        <CategoryShowcase categories={categories} />
        <HowItWorks />
        <StudyAbroadBand
          scholarships={closingSoon.scholarships}
          scholarshipCount={closingSoon.total}
          countryCount={countryCount}
        />
        <MentorCallout />
      </main>
      <Footer />
    </>
  );
}
