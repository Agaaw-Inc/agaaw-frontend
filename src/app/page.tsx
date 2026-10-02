import MainNavbar from "@/components/navbar/MainNavbar";
import HeroSection from "@/components/landing/HeroSection";
import MentorBanner from "@/components/landing/MentorBanner";
import Footer from "@/components/landing/Footer";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import HowItWorks from "@/components/home/HowItWorks";
import StudyAbroadBand from "@/components/home/StudyAbroadBand";
import { getCategories } from "@/lib/categories";
import { getClosingSoonScholarships, getCountryCount } from "@/lib/homeData";

/**
 * Agaaw as a multi-category mentorship platform. A server component: data is
 * fetched at build time and refreshed every 5 minutes, so the page is served
 * pre-built and fast, with no loading spinners.
 */
export default async function HomePage() {
  const [categories, closingSoon, countryCount] = await Promise.all([
    getCategories(),
    getClosingSoonScholarships(4),
    getCountryCount(),
  ]);

  return (
    <>
      <MainNavbar />
      <main className="bg-paper">
        <HeroSection />
        <CategoryShowcase categories={categories} />
        <HowItWorks />
        <StudyAbroadBand
          scholarships={closingSoon.scholarships}
          scholarshipCount={closingSoon.total}
          countryCount={countryCount}
        />
        <section className="bg-paper py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <MentorBanner />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
