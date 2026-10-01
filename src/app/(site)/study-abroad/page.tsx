import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, GraduationCap, Users } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import ScholarshipsPreview from "@/components/scholarships/ScholarshipsPreview";
import CountriesPreview from "@/components/countries/CountriesPreview";
import ServiceListingCard from "@/components/categories/ServiceListingCard";
import { getCategoryBySlug, getPublicServices } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Study abroad | Agaaw",
  description: "Scholarships, countries and mentors who are already studying abroad.",
};

const QUICK_LINKS = [
  {
    href: "/scholarships",
    title: "Scholarships",
    desc: "Funding by country, level and deadline.",
    icon: GraduationCap,
  },
  {
    href: "/countries",
    title: "Countries",
    desc: "Costs, visas, admissions and work rights.",
    icon: Globe,
  },
  {
    href: "/mentors",
    title: "Mentors",
    desc: "Students already living your plan.",
    icon: Users,
  },
];

/**
 * The study-abroad hub: the platform's original features (scholarships,
 * countries, mentors) gathered under one category. /categories/study-abroad
 * redirects here.
 */
export default async function StudyAbroadPage() {
  // The page still renders with its static content if the API is unreachable.
  const category = await getCategoryBySlug("study-abroad").catch(() => null);
  const services = category
    ? await getPublicServices({ categoryId: category.id, limit: 6 }).catch(() => null)
    : null;

  return (
    <>
      <MainNavbar />

      <main className="bg-white">
        {/* Header */}
        <section className="bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600">
          <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Study <span className="text-teal-100">abroad</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-teal-50/90 leading-relaxed">
              {category?.description ??
                "Scholarships, applications, visas and life abroad — guidance from students already there."}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {QUICK_LINKS.map(({ href, title, desc, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-start gap-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-5 hover:bg-white/15 transition-colors"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white shrink-0">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-white flex items-center gap-1.5">
                      {title}
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </p>
                    <p className="text-sm text-teal-50/80 mt-0.5">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Services from study-abroad mentors */}
        {services && services.data.length > 0 && (
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Mentor <span className="text-teal-700">Services</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.data.map((service) => (
                  <ServiceListingCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          </section>
        )}

        <ScholarshipsPreview />
        <CountriesPreview />
      </main>

      <Footer />
    </>
  );
}
