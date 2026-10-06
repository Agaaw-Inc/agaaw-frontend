import MainNavbar from "@/components/navbar/MainNavbar";
import HeroSection from "@/components/landing/HeroSection";
import MentorBanner from "@/components/landing/MentorBanner";
import Footer from "@/components/landing/Footer";
import HowItWorks from "@/components/home/HowItWorks";
import StudyAbroadBand from "@/components/home/StudyAbroadBand";
import { getClosingSoonScholarships, getCountryCount } from "@/lib/homeData";

/**
 * A server component: data is fetched at build time and refreshed every 5
 * minutes, so the page is served pre-built and fast, with no loading spinners.
 */
export default async function HomePage() {
  const [closingSoon, countryCount] = await Promise.all([
    getClosingSoonScholarships(4),
    getCountryCount(),
  ]);

  return (
    <>
      <MainNavbar />
      <main className="bg-paper">
        <HeroSection />
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
