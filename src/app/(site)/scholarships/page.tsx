"use client";

import ScholarshipCard from "@/components/scholarships/ScholarshipCard";
import MainNavbar from "@/components/navbar/MainNavbar";
import Link from "next/link";
import Footer from "@/components/landing/Footer";
import { Search, ChevronDown, Loader2, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/ui/Pagination";
import {
  getScholarshipFilters,
  getScholarships,
  type PublicScholarship,
  type PublicScholarshipFilters,
  type PublicScholarshipQueryParams,
} from "@/lib/api";

const ITEMS_PER_PAGE = 4;
const FALLBACK_IMAGE = "/images/scholarship-agaaw.png";

function formatDeadline(deadline: string | null) {
  if (!deadline) return "Ongoing";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(deadline));
}

function formatCoverage(coverage: PublicScholarship["coverage"]) {
  return {
    full: "Full Coverage",
    partial: "Partial Coverage",
    varies: "Varies",
  }[coverage];
}

function getOptionLabel(
  options: { label: string; value: string }[],
  value: string,
  fallback: string
) {
  return options.find((option) => option.value === value)?.label || fallback;
}

function ScholarshipList() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [levelFilter, setLevelFilter] = useState<PublicScholarshipQueryParams["level"] | "">("");
  const [coverageFilter, setCoverageFilter] = useState<PublicScholarshipQueryParams["coverage"] | "">("");
  const [countryFilter, setCountryFilter] = useState(searchParams.get("country") || "");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [scholarships, setScholarships] = useState<PublicScholarship[]>([]);
  const [filters, setFilters] = useState<PublicScholarshipFilters>({
    countries: [],
    levels: [],
    coverage: [],
    categories: [],
  });
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const country = searchParams.get("country") || "";
    setCountryFilter(country);
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchDebounced(searchQuery);
      setCurrentPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function loadFilters() {
      try {
        const result = await getScholarshipFilters();
        setFilters(result);
      } catch {
        setFilters({
          countries: [],
          levels: [],
          coverage: [],
          categories: [],
        });
      }
    }

    loadFilters();
  }, []);

  useEffect(() => {
    async function loadScholarships() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getScholarships({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchDebounced,
          country: countryFilter || undefined,
          level: levelFilter || undefined,
          coverage: coverageFilter || undefined,
          category: categoryFilter || undefined,
        });
        setScholarships(result.data);
        setTotalPages(result.meta.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load scholarships");
        setScholarships([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    }

    loadScholarships();
  }, [currentPage, searchDebounced, countryFilter, levelFilter, coverageFilter, categoryFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevelFilter(e.target.value as PublicScholarshipQueryParams["level"] | "");
    setCurrentPage(1);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleCoverageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCoverageFilter(e.target.value as PublicScholarshipQueryParams["coverage"] | "");
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
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
              A high-end editorial gallery of the world&apos;s most prestigious scholarships. We curate opportunities
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
                  <option value="">Degree Level</option>
                  {filters.levels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
              </div>
              <div className="relative group">
                <select
                  className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm"
                  value={countryFilter}
                  onChange={handleCountryChange}
                >
                  <option value="">Country</option>
                  {filters.countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
              </div>
              <div className="relative group">
                <select
                  className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm"
                  value={coverageFilter}
                  onChange={handleCoverageChange}
                >
                  <option value="">Coverage</option>
                  {filters.coverage.map((coverage) => (
                    <option key={coverage.value} value={coverage.value}>
                      {coverage.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
              </div>
              <div className="relative group">
                <select
                  className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm"
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                >
                  <option value="">Category</option>
                  {filters.categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6 items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-bombay pr-2">Popular:</span>
            {filters.coverage.some((coverage) => coverage.value === "full") && (
              <button
                onClick={() => { setCoverageFilter(coverageFilter === "full" ? "" : "full"); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center ${
                  coverageFilter === "full"
                    ? "bg-elm/10 text-elm hover:bg-elm/20"
                    : "bg-white border border-slate-200 text-codgray hover:bg-slate-50"
                }`}
              >
                {getOptionLabel(filters.coverage, "full", "Full Coverage")}
                {coverageFilter === "full" && <X className="w-3 h-3 ml-1" />}
              </button>
            )}
            {filters.levels
              .filter((level) => ["bachelors", "masters"].includes(level.value))
              .slice(0, 2)
              .map((level) => (
                <button
                  key={level.value}
                  onClick={() => { setLevelFilter(levelFilter === level.value ? "" : level.value as PublicScholarshipQueryParams["level"]); setCurrentPage(1); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center ${
                    levelFilter === level.value
                      ? "bg-elm/10 text-elm hover:bg-elm/20"
                      : "bg-white border border-slate-200 text-codgray hover:bg-slate-50"
                  }`}
                >
                  {level.label}
                  {levelFilter === level.value && <X className="w-3 h-3 ml-1" />}
                </button>
              ))}
            {filters.categories.slice(0, 2).map((category) => (
              <button
                key={category.value}
                onClick={() => { setCategoryFilter(categoryFilter === category.value ? "" : category.value); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center ${
                  categoryFilter === category.value
                    ? "bg-elm/10 text-elm hover:bg-elm/20"
                    : "bg-white border border-slate-200 text-codgray hover:bg-slate-50"
                }`}
              >
                {category.label}
                {categoryFilter === category.value && <X className="w-3 h-3 ml-1" />}
              </button>
            ))}
          </div>
        </section>

        {/* Scholarship Grid */}
        <section className="px-8 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-bombay">
              <Loader2 className="w-8 h-8 animate-spin mr-3 text-elm" />
              Loading scholarships...
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-xl text-red-600">{error}</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchDebounced("");
                  setLevelFilter("");
                  setCoverageFilter("");
                  setCountryFilter("");
                  setCategoryFilter("");
                  setCurrentPage(1);
                }}
                className="mt-4 text-elm font-medium hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : scholarships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {scholarships.map((sch) => (
                <ScholarshipCard
                  key={sch.slug}
                  slug={sch.slug}
                  title={sch.name}
                  university={sch.provider}
                  deadline={formatDeadline(sch.deadline)}
                  image={sch.bannerImage || FALLBACK_IMAGE}
                  funding={formatCoverage(sch.coverage)}
                  amount={sch.amount || undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-bombay">No scholarships found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchDebounced("");
                  setLevelFilter("");
                  setCoverageFilter("");
                  setCountryFilter("");
                  setCategoryFilter("");
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

export default function ScholarshipsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-elm mb-4" />
        <p className="text-bombay font-medium">Preparing scholarships...</p>
      </div>
    }>
      <ScholarshipList />
    </Suspense>
  );
}
