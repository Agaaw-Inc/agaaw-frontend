import ScholarshipCard from "@/components/scholarships/ScholarshipCard";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import { Search, ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { SCHOLARSHIPS } from "@/data/scholarships";

export default function ScholarshipsPage() {
  return (
    <>
      <MainNavbar />

      <main className="pt-15 pb-20 bg-white">
        {/* Hero Section */}
        <section className="relative px-8 pt-10 pb-20 max-w-7xl mx-auto overflow-hidden">
          <div className="relative z-10 lg:w-2/3">
            <span className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-widest uppercase rounded-full bg-elm/10 text-elm">
              Curated Excellence
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-codgray mb-6 leading-[1.1]">
              Find Your Path to <br />
              <span className="text-elm">Academic Excellence</span>
            </h1>
            <p className="text-lg md:text-xl text-bombay max-w-xl leading-relaxed mb-10">
              A high-end editorial gallery of the world's most prestigious scholarships. We curate opportunities
              that transform ambitious students into global leaders.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-codgray text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 ambient-shadow hover:bg-codgray/90 transition-colors">
                Explore Opportunities <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 rounded-lg font-bold text-codgray hover:bg-slate-100 transition-colors">
                Institutional Partners
              </button>
            </div>
          </div>
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-[-5%] w-[50%] h-full pointer-events-none hidden lg:block opacity-15">
            <div 
                className="w-full h-full bg-[#20B2AA]"
                style={{
                    maskImage: "url('/scholarship-bg.svg')",
                    WebkitMaskImage: "url('/scholarship-bg.svg')",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center right",
                    WebkitMaskPosition: "center right"
                }}
            ></div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="px-8 mb-12 max-w-7xl mx-auto">
          <div className="bg-slate-50 p-2 rounded-xl flex flex-col md:flex-row gap-2 border border-slate-100">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-elm" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg focus:ring-2 focus:ring-elm/20 outline-none text-codgray shadow-sm"
                placeholder="Search by scholarship, institution, or country..."
                type="text"
              />
            </div>
            <div className="flex md:flex-row flex-col gap-2">
              <div className="relative group">
                <select className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm">
                  <option>Degree Level</option>
                  <option>Masters</option>
                  <option>PhD</option>
                  <option>Post-Doc</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
              </div>
              <div className="relative group">
                <select className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm">
                  <option>Country</option>
                  <option>Germany</option>
                  <option>United Kingdom</option>
                  <option>United States</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6 items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-bombay pr-2">Popular:</span>
            <button className="px-4 py-1.5 bg-elm/10 text-elm rounded-full text-xs font-medium">Fully Funded</button>
            <button className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors">STEM</button>
            <button className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors">Humanities</button>
            <button className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors">Underrepresented Groups</button>
          </div>
        </section>

        {/* Scholarship Grid */}
        <section className="px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Object.values(SCHOLARSHIPS).map((sch) => (
              <ScholarshipCard
                key={sch.slug}
                slug={sch.slug}
                title={sch.name}
                university={sch.provider}
                deadline={sch.deadline}
                image={sch.image}
                funding={sch.funding}
                amount={sch.amount}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-20 flex justify-center items-center gap-2">
            <button className="w-10 h-10 rounded-lg flex items-center justify-center text-elm hover:bg-slate-100 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-codgray text-white font-bold ambient-shadow">1</button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center text-codgray hover:bg-slate-100 transition-colors font-medium">2</button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center text-codgray hover:bg-slate-100 transition-colors font-medium">3</button>
            <span className="px-2 text-bombay">...</span>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center text-codgray hover:bg-slate-100 transition-colors font-medium">12</button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center text-elm hover:bg-slate-100 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}