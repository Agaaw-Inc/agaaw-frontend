"use client";

import CountryCard from "@/components/countries/CountryCard";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import { Search, ChevronDown, X } from "lucide-react";
import { getCountries } from "@/lib/api";
import { useState, useMemo, useEffect } from "react";
import Pagination from "@/components/ui/Pagination";

const ITEMS_PER_PAGE = 6;

interface CountryListItem {
    slug: string;
    name: string;
    image: string;
    region?: string;
    language?: string;
    shortIntro?: string;
}

export default function CountriesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [regionFilter, setRegionFilter] = useState("");
    const [languageFilter, setLanguageFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [allCountries, setAllCountries] = useState<CountryListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCountries() {
            try {
                const data = await getCountries();
                setAllCountries(data);
            } catch (error) {
                console.error("Failed to fetch countries:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCountries();
    }, []);

    const filteredCountries = useMemo(() => {
        return allCountries.filter((country) => {
            const normalizedSearch = searchQuery.toLowerCase();
            const matchesSearch =
                country.name.toLowerCase().includes(normalizedSearch) ||
                (country.region || "").toLowerCase().includes(normalizedSearch) ||
                (country.language || "").toLowerCase().includes(normalizedSearch);
            const matchesRegion = !regionFilter || country.region === regionFilter;
            const matchesLanguage = !languageFilter || country.language === languageFilter;
            return matchesSearch && matchesRegion && matchesLanguage;
        });
    }, [allCountries, searchQuery, regionFilter, languageFilter]);

    const regionOptions = useMemo(() => {
        return Array.from(
            new Set(allCountries.map((country) => country.region).filter((region): region is string => Boolean(region)))
        ).sort();
    }, [allCountries]);

    const languageOptions = useMemo(() => {
        return Array.from(
            new Set(allCountries.map((country) => country.language).filter((language): language is string => Boolean(language)))
        ).sort();
    }, [allCountries]);

    const quickRegions = regionOptions.slice(0, 2);
    const quickLanguages = [
        ...languageOptions.filter((language) => language === "English"),
        ...languageOptions.filter((language) => language !== "English"),
    ].slice(0, 2);

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
                                    <option value="">Region</option>
                                    {regionOptions.map((region) => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
                            </div>
                            <div className="relative group">
                                <select
                                    className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm"
                                    value={languageFilter}
                                    onChange={(e) => { setLanguageFilter(e.target.value); setCurrentPage(1); }}
                                >
                                    <option value="">Language</option>
                                    {languageOptions.map((language) => (
                                        <option key={language} value={language}>{language}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-6 items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-bombay pr-2">Popular:</span>
                        {quickRegions.map((region) => (
                            <button
                                key={region}
                                onClick={() => { setRegionFilter(regionFilter === region ? "" : region); setCurrentPage(1); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center ${
                                    regionFilter === region
                                        ? "bg-elm/10 text-elm hover:bg-elm/20"
                                        : "bg-white border border-slate-200 text-codgray hover:bg-slate-50"
                                }`}
                            >
                                {region}
                                {regionFilter === region && <X className="w-3 h-3 ml-1" />}
                            </button>
                        ))}
                        {quickLanguages.map((language) => (
                            <button
                                key={language}
                                onClick={() => { setLanguageFilter(languageFilter === language ? "" : language); setCurrentPage(1); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center ${
                                    languageFilter === language
                                        ? "bg-elm/10 text-elm hover:bg-elm/20"
                                        : "bg-white border border-slate-200 text-codgray hover:bg-slate-50"
                                }`}
                            >
                                Study in {language}
                                {languageFilter === language && <X className="w-3 h-3 ml-1" />}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Grid Section */}
                <section className="py-12 px-6 max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {regionFilter ? `${regionFilter} Destinations` : "Popular Destinations"}
                        </h2>
                        <span
                            onClick={() => {
                                setSearchQuery("");
                                setRegionFilter("");
                                setLanguageFilter("");
                                setCurrentPage(1);
                            }}
                            className="text-sm font-medium text-teal-700 cursor-pointer hover:underline"
                        >
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-bombay animate-pulse">Loading countries...</p>
                        </div>
                    ) : currentCountries.length > 0 ? (
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
