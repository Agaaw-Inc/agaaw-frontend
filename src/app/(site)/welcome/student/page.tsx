import WelcomeHero from "@/components/shared/WelcomeHero";
import ScholarshipsPreview from "@/components/scholarships/ScholarshipsPreview";
import CountryPreview from "@/components/countries/CountriesPreview";
import BlogsPreview from "@/components/shared/BlogsPreview";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";

export default function StudentWelcomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />
      <main className="flex-grow">
        <WelcomeHero role="student" />
        
        <div className="bg-slate-50">
          <ScholarshipsPreview />
          <CountryPreview />
          <BlogsPreview />
        </div>
      </main>
      <Footer />
    </div>
  );
}
