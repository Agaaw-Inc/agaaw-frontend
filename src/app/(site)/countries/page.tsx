"use client";

import CountryCard from "@/components/countries/CountryCard";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import { COUNTRIES } from "@/data/countries";
import { useState, useMemo } from "react";
import Pagination from "@/components/ui/Pagination";

const ITEMS_PER_PAGE = 6;

// Helper to categorize countries for mock filtering
const getRegion = (slug: string) => {
    const regions: Record<string, string> = {
        canada: "North America",
        "united-kingdom": "Europe",
        germany: "Europe",
        australia: "Oceania",
        usa: "North America",
        japan: "Asia",
        france: "Europe",
        switzerland: "Europe",
        netherlands: "Europe",
    };
    return regions[slug] || "Other";
};

const getLanguage = (slug: string) => {
    const languages: Record<string, string> = {
        canada: "English",
        "united-kingdom": "English",
        germany: "German",
        australia: "English",
        "united-states": "English",
        japan: "Japanese",
        france: "French",
        switzerland: "German", // Simplified for mock
        netherlands: "English",
    };
    return languages[slug] || "English";
};

export default function CountriesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [regionFilter, setRegionFilter] = useState("Region");
    const [languageFilter, setLanguageFilter] = useState("Language");
    const [currentPage, setCurrentPage] = useState(1);

    const allCountries = useMemo(() => Object.values(COUNTRIES), []);

    const filteredCountries = useMemo(() => {
        return allCountries.filter((country) => {
            const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRegion = regionFilter === "Region" || getRegion(country.slug) === regionFilter;
            const matchesLanguage = languageFilter === "Language" || getLanguage(country.slug) === languageFilter;
            return matchesSearch && matchesRegion && matchesLanguage;
        });
    }, [allCountries, searchQuery, regionFilter, languageFilter]);

    const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
    const currentCountries = filteredCountries.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <MainNavbar />

            <main className="flex-grow pt-16 pb-20">
                {/* Hero Section */}
                <section className="relative px-6 pt-2 pb-15 max-w-7xl mx-auto overflow-hidden">
                    <div className="relative z-10 lg:w-2/3">
                        <span className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-widest uppercase rounded-full bg-elm/10 text-elm">
                            Global Destinations
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-codgray mb-6 leading-[1.1]">
                            Explore <br />
                            <span className="text-elm">Countries</span>
                        </h1>
                        <p className="text-lg md:text-xl text-bombay max-w-xl leading-relaxed mb-10">
                            Discover top-tier educational opportunities across the globe. Choose a
                            destination to explore universities, culture, and student life.
                        </p>
                    </div>
                    {/* World Map Decorative Element */}
                    <div className="absolute top-0 right-[-5%] w-[60%] h-full pointer-events-none hidden lg:block opacity-15">
                        <div
                            className="w-full h-full bg-[#20B2AA]"
                            style={{
                                maskImage: "url('/world-map.svg')",
                                WebkitMaskImage: "url('/world-map.svg')",
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
                                placeholder="Search by country, region, or city..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <div className="flex md:flex-row flex-col gap-2">
                            <div className="relative group">
                                <select
                                    className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm"
                                    value={regionFilter}
                                    onChange={(e) => { setRegionFilter(e.target.value); setCurrentPage(1); }}
                                >
                                    <option>Region</option>
                                    <option>Europe</option>
                                    <option>North America</option>
                                    <option>Asia</option>
                                    <option>Oceania</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
                            </div>
                            <div className="relative group">
                                <select
                                    className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm"
                                    value={languageFilter}
                                    onChange={(e) => { setLanguageFilter(e.target.value); setCurrentPage(1); }}
                                >
                                    <option>Language</option>
                                    <option>English</option>
                                    <option>German</option>
                                    <option>French</option>
                                    <option>Japanese</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-6 items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-bombay pr-2">Popular:</span>
                        <button
                            onClick={() => { setRegionFilter("Europe"); setCurrentPage(1); }}
                            className="px-4 py-1.5 bg-elm/10 text-elm rounded-full text-xs font-medium hover:bg-elm/20 transition-colors"
                        >
                            Europe
                        </button>
                        <button
                            onClick={() => { setLanguageFilter("English"); setCurrentPage(1); }}
                            className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors"
                        >
                            Study in English
                        </button>
                        <button
                            onClick={() => { setSearchQuery("Post-Study Visa"); setCurrentPage(1); }}
                            className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors"
                        >
                            Post-Study Visa
                        </button>
                        <button
                            onClick={() => { setSearchQuery("Tuition"); setCurrentPage(1); }}
                            className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors"
                        >
                            Low Tuition
                        </button>
                    </div>
                </section>

                {/* Grid Section */}
                <section className="py-12 px-6 max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {regionFilter !== "Region" ? `${regionFilter} Destinations` : "Popular Destinations"}
                        </h2>
                        <span
                            onClick={() => {
                                setSearchQuery("");
                                setRegionFilter("Region");
                                setLanguageFilter("Language");
                                setCurrentPage(1);
                            }}
                            className="text-sm font-medium text-teal-700 cursor-pointer hover:underline"
                        >
                        </span>
                    </div>

                    {currentCountries.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentCountries.map((country) => (
                                <CountryCard
                                    key={country.name}
                                    name={country.name}
                                    image={country.image}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-xl text-bombay">No countries found matching your criteria.</p>
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
        </div>
    );
}