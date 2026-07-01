"use client";
import MentorCard from "@/components/mentors/MentorCard";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import { Search, ChevronDown, Loader2, X, Sparkles, ArrowRight, Star } from "lucide-react";
import { MOCK_MENTORS, MOCK_STUDENTS } from "@/lib/mock/profileData";
import { getUserInfo, type UserInfo } from "@/lib/auth";
import type { StudentProfile } from "@/data/profileTypes";
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
    const [universityFilter, setUniversityFilter] = useState("");
    const [expertiseFilter, setExpertiseFilter] = useState("");
    const [matchTargets, setMatchTargets] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    // Load user session and mapping
    useEffect(() => {
        const info = getUserInfo();
        setUserInfo(info);
        if (info && info.role === "student") {
            const student = MOCK_STUDENTS.find(
                (s) =>
                    s.name.toLowerCase().includes(info.firstName.toLowerCase()) ||
                    s.username.toLowerCase().includes(info.firstName.toLowerCase())
            );
            setStudentProfile(student || MOCK_STUDENTS[0]);
        } else if (!info) {
            // Fallback/simulation mode when not logged in officially, default to target "omar-faruk"
            const defaultStudent = MOCK_STUDENTS.find((s) => s.username === "omar-faruk");
            setStudentProfile(defaultStudent || null);
        }
    }, []);
    // Update filter from search parameters if any
    useEffect(() => {
        const country = searchParams.get("country") || "";
        if (country) setCountryFilter(country);
        const university = searchParams.get("university") || "";
        if (university) setUniversityFilter(university);
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
    // Unique country and university options from all mentors
    const countryOptions = useMemo(() => {
        return Array.from(new Set(MOCK_MENTORS.map((m) => m.country))).sort();
    }, []);
    const universityOptions = useMemo(() => {
        return Array.from(new Set(MOCK_MENTORS.map((m) => m.university))).sort();
    }, []);
    // Filter and Sort Mentors
    const processedMentors = useMemo(() => {
        // 1. Filter
        let filtered = MOCK_MENTORS.filter((mentor) => {
            const nameMatch = mentor.name.toLowerCase().includes(searchDebounced.toLowerCase());
            const uniMatch = mentor.university.toLowerCase().includes(searchDebounced.toLowerCase());
            const expertMatch = mentor.expertise.some((exp) =>
                exp.toLowerCase().includes(searchDebounced.toLowerCase())
            );
            const matchesSearch = nameMatch || uniMatch || expertMatch;
            const matchesCountry = !countryFilter || mentor.country === countryFilter;
            const matchesUniversity = !universityFilter || mentor.university === universityFilter;

            // Check expertise (partial match)
            const matchesExpertise =
                !expertiseFilter ||
                mentor.expertise.some((exp) =>
                    exp.toLowerCase().includes(expertiseFilter.toLowerCase())
                );
            let matchesTargetsFilter = true;
            if (matchTargets && studentProfile) {
                matchesTargetsFilter = studentProfile.goals.targetCountries.includes(mentor.country);
            }
            return matchesSearch && matchesCountry && matchesUniversity && matchesExpertise && matchesTargetsFilter;
        });
        // 2. Sort: prioritized by student's target countries, then verified, then rating
        return [...filtered].sort((a, b) => {
            if (studentProfile) {
                const aMatchesTarget = studentProfile.goals.targetCountries.includes(a.country) ? 1 : 0;
                const bMatchesTarget = studentProfile.goals.targetCountries.includes(b.country) ? 1 : 0;
                if (aMatchesTarget !== bMatchesTarget) {
                    return bMatchesTarget - aMatchesTarget; // target country matches first
                }
            }
            // verified first
            const aVerified = a.isVerified ? 1 : 0;
            const bVerified = b.isVerified ? 1 : 0;
            if (aVerified !== bVerified) {
                return bVerified - aVerified;
            }
            // rating descending
            if (b.stats.rating !== a.stats.rating) {
                return b.stats.rating - a.stats.rating;
            }
            // students helped descending
            return b.stats.studentsHelped - a.stats.studentsHelped;
        });
    }, [searchDebounced, countryFilter, universityFilter, expertiseFilter, matchTargets, studentProfile]);
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
        setUniversityFilter("");
        setExpertiseFilter("");
        setMatchTargets(false);
        setCurrentPage(1);
    };
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <MainNavbar />
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
                        {studentProfile && (
                            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-emerald-800 font-medium animate-fadeIn">
                                <Sparkles className="w-4.5 h-4.5 text-emerald-600 animate-pulse flex-shrink-0" />
                                <span>
                                    Listing optimized for your target countries:{" "}
                                    <strong className="text-emerald-900">{studentProfile.goals.targetCountries.join(", ")}</strong>
                                </span>
                            </div>
                        )}
                    </div>
                    {/* Decorative Elements */}
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
                {/* CTA Banner for Mentors */}
                {userInfo?.role === "mentor" && (
                    <section className="px-8 mb-8 max-w-7xl mx-auto">
                        <div className="bg-teal-600 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md shadow-teal-700/10">
                            <div>
                                <h2 className="text-xl font-bold">Are you ready to share your expertise?</h2>
                                <p className="text-teal-100 text-sm mt-1">Browse students who are seeking mentorship and guidance for their studies abroad.</p>
                            </div>
                            <Link href="/students" className="w-full md:w-auto">
                                <button className="w-full bg-white hover:bg-slate-50 text-teal-800 font-bold px-6 py-3 rounded-xl transition-all shadow-sm active:scale-[0.98] duration-150 flex items-center justify-center gap-2">
                                    Browse Students <ArrowRight className="w-4 h-4 text-teal-700" />
                                </button>
                            </Link>
                        </div>
                    </section>
                )}
                {/* Filters Section */}
                <section className="px-8 mb-12 max-w-7xl mx-auto">
                    <div className="bg-slate-50 p-2 rounded-xl flex flex-col lg:flex-row gap-2 border border-slate-100 shadow-sm bg-white">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-elm" />
                            <input
                                className="w-full pl-12 pr-4 py-4 bg-transparent border-none rounded-lg focus:ring-0 outline-none text-codgray"
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
                            <div className="relative group flex-1 sm:flex-initial">
                                <select
                                    className="appearance-none w-full sm:w-56 bg-transparent border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium outline-none cursor-pointer"
                                    value={universityFilter}
                                    onChange={(e) => {
                                        setUniversityFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">All Universities</option>
                                    {universityOptions.map((uni) => (
                                        <option key={uni} value={uni}>
                                            {uni}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
                            </div>
                            {/* Personalization Toggle */}
                            {studentProfile && (
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
                                const isMatch = studentProfile?.goals.targetCountries.includes(mentor.country) || false;
                                return (
                                    <MentorCard
                                        key={mentor.username}
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

