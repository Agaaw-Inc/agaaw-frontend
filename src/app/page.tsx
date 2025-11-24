import MainNavbar from "@/components/navbar/MainNavbar";
import HeroSection from "@/components/landing/HeroSection";
import ImageCarousel from "@/components/landing/ImageCorousel";
import WhyChooseSection from "@/components/landing/WhyChooseSection";
import ForStudentsSection from "@/components/landing/ForStudent";
import ForMentorsSection from "@/components/landing/ForMentor";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <MainNavbar />

      <HeroSection />

      <ImageCarousel />

      <WhyChooseSection />

      <div className="bg-codgray text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 grid gap-16 md:grid-cols-2">
          <ForStudentsSection />
          <ForMentorsSection />
        </div>
      </div>

      <Footer />
    </>
  );
}
