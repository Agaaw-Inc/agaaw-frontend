import { COUNTRIES } from "@/data/countries";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import { 
    Globe, 
    CalendarClock, 
    CheckCircle2, 
    ChevronRight,
    Search,
    Award,
    ListOrdered,
    Library,
    Briefcase,
    Banknote
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CountryProps {
  params: Promise<{
    country: string;
  }>;
}

export async function generateMetadata({ params }: CountryProps) {
  const { country } = await params;
  const data = COUNTRIES[country.toLowerCase()];

  const title = data
    ? `Study in ${data.name} | Agaaw Scholar`
    : "Study Abroad Country Guide | Agaaw Scholar";

  return {
    title,
    description:
      data?.shortIntro ??
      "Country guide for international students on Agaaw Scholar.",
  };
}

export default async function CountryDetails({ params }: CountryProps) {
  const { country } = await params;
  const key = country.toLowerCase();
  const data = COUNTRIES[key];

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MainNavbar />
      
      {/* Hero Section */}
      <div className="bg-teal-900 border-b border-teal-800 text-white pt-20 pb-24 px-6">
          <div className="max-w-5xl mx-auto">
              <Link href="/countries" className="inline-flex items-center text-teal-200 hover:text-white mb-8 transition-colors text-sm font-medium">
                  <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                  Back to Countries
              </Link>
              
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-between">
                  <div className="flex-1">
                      <span className="inline-block px-4 py-1.5 bg-teal-800/50 text-teal-100 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-teal-700/50">
                          Study Abroad Guide
                      </span>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white min-h-[4rem]">
                          Study in {data.name}
                      </h1>
                      <p className="text-lg md:text-xl text-teal-50 max-w-2xl leading-relaxed font-light">
                          {data.shortIntro}
                      </p>
                  </div>
                  
                  {/* Meta Info Box */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 w-full md:w-auto md:min-w-[300px] shrink-0 mt-4 md:mt-0 shadow-xl shadow-teal-950/20">
                      <h3 className="text-xs font-bold text-teal-200 uppercase tracking-widest mb-5">Quick Details</h3>
                      <ul className="space-y-5">
                          <li className="flex items-center gap-4">
                              <div className="bg-white/10 p-2.5 rounded-xl"><Banknote className="w-5 h-5 text-teal-200" /></div>
                              <div>
                                  <p className="text-[11px] font-semibold tracking-wider text-teal-300 uppercase mb-0.5">Average Cost</p>
                                  <p className="font-medium text-white max-w-[200px] sm:max-w-[250px] truncate" title={data.avgCost}>{data.avgCost}</p>
                              </div>
                          </li>
                          <li className="flex items-center gap-4">
                              <div className="bg-white/10 p-2.5 rounded-xl"><Globe className="w-5 h-5 text-teal-200" /></div>
                              <div>
                                  <p className="text-[11px] font-semibold tracking-wider text-teal-300 uppercase mb-0.5">Visa Policy</p>
                                  <p className="font-medium text-white max-w-[200px] sm:max-w-[250px] truncate" title={data.visaPolicy}>{data.visaPolicy}</p>
                              </div>
                          </li>
                          <li className="flex items-center gap-4">
                              <div className="bg-white/10 p-2.5 rounded-xl"><CalendarClock className="w-5 h-5 text-teal-200" /></div>
                              <div>
                                  <p className="text-[11px] font-semibold tracking-wider text-teal-300 uppercase mb-0.5">When to Apply</p>
                                  <p className="font-medium text-white max-w-[200px] sm:max-w-[250px] truncate" title={data.whenToApply}>{data.whenToApply}</p>
                              </div>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 -mt-10 mb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column (Details) */}
              <div className="lg:col-span-2 space-y-5">
                  {/* Opportunities Card */}
                  <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                      <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                          <div className="bg-emerald-100 p-3 rounded-2xl">
                              <Award className="w-7 h-7 text-emerald-700" />
                          </div>
                          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Opportunities</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {data.opportunities.map((item, idx) => (
                              <div key={idx} className="flex gap-3 bg-slate-50 hover:bg-slate-100/80 transition-colors p-5 rounded-2xl border border-slate-100">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span className="text-slate-700 leading-relaxed text-sm md:text-base font-medium">{item}</span>
                              </div>
                          ))}
                      </div>
                  </section>

                  {/* Top Universities Card */}
                  <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                      <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                          <div className="bg-indigo-100 p-3 rounded-2xl">
                              <Library className="w-7 h-7 text-indigo-700" />
                          </div>
                          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Top Universities</h2>
                      </div>
                      <ul className="space-y-2">
                          {data.universities.map((item, idx) => (
                              <li key={idx} className="flex gap-4 items-center px-4 py-2.5 hover:bg-slate-50 transition-colors rounded-xl border border-slate-50">
                                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                      <Library className="w-4 h-4 text-indigo-400" />
                                  </div>
                                  <p className="text-slate-700 leading-relaxed font-medium flex-1">{item}</p>
                              </li>
                          ))}
                      </ul>
                  </section>

                  {/* Job Opportunities Card */}
                  <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                      <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                          <div className="bg-amber-100 p-3 rounded-2xl">
                              <Briefcase className="w-7 h-7 text-amber-700" />
                          </div>
                          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Job Opportunities</h2>
                      </div>
                      <ul className="space-y-4">
                          {data.jobOpportunities.map((item, idx) => (
                              <li key={idx} className="flex gap-4 items-start p-4 hover:bg-slate-50 transition-colors rounded-xl">
                                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 mt-2 shadow-sm"></div>
                                  <p className="text-slate-700 leading-relaxed font-medium flex-1">{item}</p>
                              </li>
                          ))}
                      </ul>
                  </section>

                  {/* How to Apply Card */}
                  <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                      <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
                          <div className="bg-blue-100 p-3 rounded-2xl">
                              <ListOrdered className="w-7 h-7 text-blue-700" />
                          </div>
                          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">How to Apply</h2>
                      </div>
                      
                      <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.1rem] md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-blue-200 before:via-blue-200 before:to-transparent">
                          {data.howToApply.map((step, idx) => (
                              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-6">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-[3px] border-blue-500 text-blue-700 font-bold text-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10 mx-auto absolute left-0 md:left-1/2 -ml-0.5 md:ml-0">
                                      {idx + 1}
                                  </div>
                                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-[3.5rem] md:ml-0 bg-white p-6 rounded-2xl border border-slate-200 group-hover:border-blue-400 group-hover:shadow-md transition-all shadow-sm">
                                      <p className="text-slate-700 text-base leading-relaxed font-medium">{step}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </section>
              </div>

              {/* Right Column (Sidebar CTA) */}
              <div className="lg:col-span-1">
                  <div className="sticky top-28 bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center">
                      <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Search className="w-8 h-8 text-teal-600 ml-1" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">Looking for Scholarships?</h3>
                      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                          Discover fully funded opportunities in <span className="font-bold text-slate-800">{data.name}</span> and start your application process today.
                      </p>
                      <Link
                          href="/scholarships"
                          className="flex items-center justify-center gap-2 w-full bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-teal-600/25 active:scale-[0.98]"
                      >
                          Find Scholarships <ChevronRight className="w-5 h-5" />
                      </Link>
                  </div>
              </div>

          </div>
      </main>

      <Footer />
    </div>
  );
}
