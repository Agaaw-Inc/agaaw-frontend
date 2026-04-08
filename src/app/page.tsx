import MainNavbar from "@/components/navbar/MainNavbar";
import HeroSection from "@/components/landing/HeroSection";
import ImageCarousel from "@/components/landing/ImageCorousel";
import WhyChooseSection from "@/components/landing/WhyChooseSection";
import MentorBanner from "@/components/landing/MentorBanner";
import ResourceBanner from "@/components/landing/ResourceBanner";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <MainNavbar />

      <HeroSection />

      <ImageCarousel />

      <WhyChooseSection />

      <div className="bg-white py-12 md:py-24">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center">
          <MentorBanner />
          <ResourceBanner />
        </div>
      </div>
      <Footer />
    </>
  );
}
