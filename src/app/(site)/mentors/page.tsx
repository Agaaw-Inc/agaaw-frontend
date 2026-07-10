"use client";
import MentorCard, { type MentorListItem } from "@/components/mentors/MentorCard";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import Pagination from "@/components/ui/Pagination";
import { Search, ChevronDown, Loader2, X, ArrowRight } from "lucide-react";
import { getUserInfo, type UserInfo } from "@/lib/auth";
import { getMentorsList, getStudentProfile } from "@/lib/api";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const popularExpertiseTags = [
    "Scholarship Essays",
    "Student Visa",
    "IELTS Strategy",
    "Financial Aid",
    "Interview Coaching",
];

function MentorList() {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchDebounced, setSearchDebounced] = useState("");
    const [countryFilter, setCountryFilter] = useState("");
    const [expertiseFilter, setExpertiseFilter] = useState("");
    const [matchTargets, setMatchTargets] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [targetCountries, setTargetCountries] = useState<string[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [mentors, setMentors] = useState<MentorListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);

    // Load user session and mentors
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const info = getUserInfo();
                setUserInfo(info);

                if (!info) {
                    setAccessDenied(true);
                    return;
                }

                // Mentors don't browse other mentors — they get a dedicated
                // banner (rendered below) pointing them to /students instead.
                if (info.role === "mentor") {
                    return;
                }

                const mentorsData = await getMentorsList();
                setMentors(Array.isArray(mentorsData) ? mentorsData : []);

                if (info.role === "student") {
                    const profile = await getStudentProfile();
                    const countries = (profile?.preferredCountries || [])
                        .map((pc: any) => pc.country?.name)
                        .filter(Boolean);
                    setTargetCountries(countries);
                }
            } catch (error) {
                console.error("Error fetching mentors:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    // Update filter from search parameters if any
    useEffect(() => {
        const country = searchParams.get("country") || "";
        if (country) setCountryFilter(country);
        const expertise = searchParams.get("expertise") || "";
        if (expertise) setExpertiseFilter(expertise);
    }, [searchParams]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchDebounced(searchQuery);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Unique country options from fetched mentors
    const countryOptions = useMemo(() => {
        return Array.from(new Set(mentors.map((m) => m.country))).sort();
    }, [mentors]);

    // Filter and Sort Mentors
    const processedMentors = useMemo(() => {
        let filtered = mentors.filter((mentor) => {
            const nameMatch = mentor.name.toLowerCase().includes(searchDebounced.toLowerCase());
            const uniMatch = mentor.university.toLowerCase().includes(searchDebounced.toLowerCase());
            const expertMatch = mentor.expertise.some((exp) =>
                exp.toLowerCase().includes(searchDebounced.toLowerCase())
            );
            const matchesSearch = !searchDebounced || nameMatch || uniMatch || expertMatch;
            const matchesCountry = !countryFilter || mentor.country === countryFilter;

            const matchesExpertise =
                !expertiseFilter ||
                mentor.expertise.some((exp) =>
                    exp.toLowerCase().includes(expertiseFilter.toLowerCase())
                );
            let matchesTargetsFilter = true;
            if (matchTargets && targetCountries.length > 0) {
                matchesTargetsFilter = targetCountries.includes(mentor.country);
            }
            return matchesSearch && matchesCountry && matchesExpertise && matchesTargetsFilter;
        });

        // Sort: prioritized by student's target countries, then verified, then experience
        return [...filtered].sort((a, b) => {
            if (targetCountries.length > 0) {
                const aMatchesTarget = targetCountries.includes(a.country) ? 1 : 0;
                const bMatchesTarget = targetCountries.includes(b.country) ? 1 : 0;
                if (aMatchesTarget !== bMatchesTarget) {
                    return bMatchesTarget - aMatchesTarget;
                }
            }
            const aVerified = a.isVerified ? 1 : 0;
            const bVerified = b.isVerified ? 1 : 0;
            if (aVerified !== bVerified) {
                return bVerified - aVerified;
            }
            return (b.experienceYears || 0) - (a.experienceYears || 0);
        });
    }, [mentors, searchDebounced, countryFilter, expertiseFilter, matchTargets, targetCountries]);

    const itemsPerPage = 6;
    const totalPages = Math.ceil(processedMentors.length / itemsPerPage);
    const currentMentors = processedMentors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSearchDebounced("");
        setCountryFilter("");
        setExpertiseFilter("");
        setMatchTargets(false);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <MainNavbar />
            {isLoading ? (
                <main className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                        <Loader2 className="w-10 h-10 animate-spin text-elm" />
                        <p className="text-sm">Loading mentors...</p>
                    </div>
                </main>
            ) : accessDenied ? (
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center px-6">
                        <div className="text-5xl mb-4">🔒</div>
                        <h2 className="text-xl font-bold text-slate-700 mb-2">Access Restricted</h2>
                        <p className="text-slate-500 mb-6">Only students can browse the mentor directory.<br />Please log in with a student account.</p>
                        <Link href="/login" className="px-6 py-3 bg-elm text-white rounded-lg font-semibold hover:bg-elm/90 transition-colors">
                            Log in as Student
                        </Link>
                    </div>
                </main>
            ) : userInfo?.role === "mentor" ? (
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center px-6 max-w-lg">
                        <h2 className="text-xl font-bold text-slate-700 mb-2">The Mentor Directory Is for Students</h2>
                        <p className="text-slate-500 mb-6">As a mentor, you can browse students who are seeking mentorship and guidance for their studies abroad.</p>
                        <Link href="/students" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors">
                            Browse Students <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </main>
            ) : (
            <main className="flex-grow pt-16 pb-20">
                {/* Hero Section */}
                <section className="relative px-8 pt-6 pb-16 max-w-7xl mx-auto overflow-hidden">
                    <div className="relative z-10 lg:w-2/3">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-codgray mb-6 leading-[1.1]">
                            Connect with <br />
                            <span className="text-elm">Expert Mentors</span>
                        </h1>
                        <p className="text-lg md:text-xl text-bombay max-w-xl leading-relaxed mb-8">
                            Gain a massive competitive edge with direct guidance from students and alumni at the world's most prestigious universities.
                        </p>
                    </div>
                    <div className="absolute top-0 right-[-5%] w-[45%] h-full pointer-events-none hidden lg:block opacity-10">
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
                            }}
                        />
                    </div>
                </section>
                {/* Filters Section */}
                <section className="px-8 mb-12 max-w-7xl mx-auto">
                    <div className="bg-slate-50 p-2 rounded-xl flex flex-col lg:flex-row gap-2 border border-slate-100 shadow-sm bg-white">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-elm" />
                            <input
                                className="w-full pl-12 pr-5 py-5 bg-transparent border-none rounded-lg focus:ring-0 outline-none text-codgray"
                                placeholder="Search mentors by name, university, or expertise..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        {/* Select Dropdowns */}
                        <div className="flex flex-col sm:flex-row gap-2 border-t lg:border-t-0 lg:border-l border-slate-100 pt-2 lg:pt-0 lg:pl-2">
                            <div className="relative group flex-1 sm:flex-initial">
                                <select
                                    className="appearance-none w-full sm:w-48 bg-transparent border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium outline-none cursor-pointer"
                                    value={countryFilter}
                                    onChange={(e) => {
                                        setCountryFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">All Countries</option>
                                    {countryOptions.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
                            </div>
                            {/* Personalization Toggle */}
                            {targetCountries.length > 0 && (
                                <div className="flex items-center gap-3 px-6 py-3 sm:py-0 border-t sm:border-t-0 sm:border-l border-slate-100">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={matchTargets}
                                            onChange={(e) => {
                                                setMatchTargets(e.target.checked);
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
                                        <span className="ml-3 text-sm font-semibold text-slate-700 whitespace-nowrap">
                                            Match My Targets
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Popular / Quick Filter Tags */}
                    <div className="flex flex-wrap gap-3 mt-6 items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-bombay pr-2">Popular:</span>
                        {popularExpertiseTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => {
                                    setExpertiseFilter(expertiseFilter === tag ? "" : tag);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center border ${expertiseFilter === tag
                                    ? "bg-elm/10 text-elm border-elm/20 hover:bg-elm/20"
                                    : "bg-white border-slate-200 text-codgray hover:bg-slate-50"
                                    }`}
                            >
                                {tag}
                                {expertiseFilter === tag && <X className="w-3.5 h-3.5 ml-1.5" />}
                            </button>
                        ))}
                    </div>
                </section>
                {/* Mentors Grid Section */}
                <section className="px-8 max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                        <h2 className="text-2xl font-extrabold text-slate-800">
                            {matchTargets ? "Recommended Mentors" : "All Mentors"}
                        </h2>
                        <span className="text-sm font-semibold text-slate-500">
                            Showing {processedMentors.length} mentor{processedMentors.length !== 1 && "s"}
                        </span>
                    </div>
                    {currentMentors.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentMentors.map((mentor) => {
                                const isMatch = targetCountries.includes(mentor.country);
                                return (
                                    <MentorCard
                                        key={mentor.id}
                                        mentor={mentor}
                                        isMatch={isMatch}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-xl mx-auto px-6">
                            <p className="text-lg font-bold text-slate-700">No mentors match your current criteria</p>
                            <p className="text-sm text-slate-500 mt-1">Try relaxing your filters or search terms to see more results.</p>
                            <button
                                onClick={clearFilters}
                                className="mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-teal-600/10 active:scale-[0.98]"
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
            )}
            <Footer />
        </div>
    );
}
export default function MentorsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-elm mb-4" />
                    <p className="text-bombay font-semibold">Preparing mentors...</p>
                </div>
            }
        >
            <MentorList />
        </Suspense>
    );
}
