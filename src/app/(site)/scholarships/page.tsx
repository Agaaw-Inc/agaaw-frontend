"use client";

import ScholarshipCard from "@/components/scholarships/ScholarshipCard";
import MainNavbar from "@/components/navbar/MainNavbar";
import Link from "next/link";
import Footer from "@/components/landing/Footer";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import { SCHOLARSHIPS } from "@/data/scholarships";
import Button from "@/components/ui/Button";
import { useState, useMemo } from "react";
import Pagination from "@/components/ui/Pagination";

const ITEMS_PER_PAGE = 4;

export default function ScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("Degree Level");
  const [countryFilter, setCountryFilter] = useState("Country");
  const [currentPage, setCurrentPage] = useState(1);

  const scholarships = useMemo(() => Object.values(SCHOLARSHIPS), []);

  const filteredScholarships = useMemo(() => {
    return scholarships.filter((sch) => {
      const matchesSearch =
        sch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel =
        levelFilter === "Degree Level" ||
        sch.level.toLowerCase().includes(levelFilter.toLowerCase());

      const matchesCountry =
        countryFilter === "Country" ||
        sch.country.toLowerCase() === countryFilter.toLowerCase();

      return matchesSearch && matchesLevel && matchesCountry;
    });
  }, [scholarships, searchQuery, levelFilter, countryFilter]);

  const totalPages = Math.ceil(filteredScholarships.length / ITEMS_PER_PAGE);
  const currentScholarships = filteredScholarships.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevelFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryFilter(e.target.value);
    setCurrentPage(1);
  };

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
              <Link href="/countries">
                <Button className="text-gray-500 hover:text-[#20B2AA] transition-colors font-medium">
                  Explore Countries
                </Button>
              </Link>
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
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex md:flex-row flex-col gap-2">
              <div className="relative group">
                <select
                  className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm"
                  value={levelFilter}
                  onChange={handleLevelChange}
                >
                  <option>Degree Level</option>
                  <option>Masters</option>
                  <option>PhD</option>
                  <option>Post-Doc</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
              </div>
              <div className="relative group">
                <select
                  className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm"
                  value={countryFilter}
                  onChange={handleCountryChange}
                >
                  <option>Country</option>
                  <option>Germany</option>
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Australia</option>
                  <option>Japan</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6 items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-bombay pr-2">Popular:</span>
            <button
              onClick={() => { setSearchQuery("Fully Funded"); setCurrentPage(1); }}
              className="px-4 py-1.5 bg-elm/10 text-elm rounded-full text-xs font-medium hover:bg-elm/20 transition-colors"
            >
              Fully Funded
            </button>
            <button
              onClick={() => { setSearchQuery("STEM"); setCurrentPage(1); }}
              className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors"
            >
              STEM
            </button>
            <button
              onClick={() => { setSearchQuery("Bachelors"); setCurrentPage(1); }}
              className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors"
            >
              Bachelors
            </button>
            <button
              onClick={() => { setLevelFilter("Masters"); setCurrentPage(1); }}
              className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors"
            >
              Masters Programs
            </button>
          </div>
        </section>

        {/* Scholarship Grid */}
        <section className="px-8 max-w-7xl mx-auto">
          {currentScholarships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentScholarships.map((sch) => (
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
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-bombay">No scholarships found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setLevelFilter("Degree Level");
                  setCountryFilter("Country");
                  setCurrentPage(1);
                }}
                className="mt-4 text-elm font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </section>
      </main>

      <Footer />
    </>
  );
}