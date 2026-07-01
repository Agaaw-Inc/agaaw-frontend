"use client";
import StudentCard from "@/components/students/StudentCard";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import Pagination from "@/components/ui/Pagination";
import { Search, ChevronDown, Loader2, X, Sparkles, UserCheck } from "lucide-react";
import { MOCK_STUDENTS, MOCK_MENTORS } from "@/lib/mock/profileData";
import { getUserInfo, type UserInfo } from "@/lib/auth";
import type { MentorProfile } from "@/data/profileTypes";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
const popularInterestTags = [
    "Artificial Intelligence",
    "Renewable Energy",
    "Open Source",
    "Social Entrepreneurship",
    "Creative Writing",
];
function StudentList() {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchDebounced, setSearchDebounced] = useState("");
    const [currentCountryFilter, setCurrentCountryFilter] = useState("");
    const [targetCountryFilter, setTargetCountryFilter] = useState("");
    const [interestFilter, setInterestFilter] = useState("");
    const [matchMyCountry, setMatchMyCountry] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    // Load user session and mapping
    useEffect(() => {
        const info = getUserInfo();
        setUserInfo(info);
        if (info && info.role === "mentor") {
            const mentor = MOCK_MENTORS.find(
                (m) =>
                    m.name.toLowerCase().includes(info.firstName.toLowerCase()) ||
                    m.username.toLowerCase().includes(info.firstName.toLowerCase())
            );
            setMentorProfile(mentor || MOCK_MENTORS[0]);
        } else if (!info) {
            // Fallback/simulation mode, default to mentor "arif-rahman" (country: United Kingdom)
            const defaultMentor = MOCK_MENTORS.find((m) => m.username === "arif-rahman");
            setMentorProfile(defaultMentor || null);
        }
    }, []);
    // Update filter from search parameters if any
    useEffect(() => {
        const fromCountry = searchParams.get("fromCountry") || "";
        if (fromCountry) setCurrentCountryFilter(fromCountry);
        const targetCountry = searchParams.get("targetCountry") || "";
        if (targetCountry) setTargetCountryFilter(targetCountry);
        const interest = searchParams.get("interest") || "";
        if (interest) setInterestFilter(interest);
    }, [searchParams]);
    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchDebounced(searchQuery);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);
    // Unique country options from all students (origin country)
    const currentCountryOptions = useMemo(() => {
        return Array.from(new Set(MOCK_STUDENTS.map((s) => s.country))).sort();
    }, []);
    // Unique target country options from all students
    const targetCountryOptions = useMemo(() => {
        const allTargets = MOCK_STUDENTS.flatMap((s) => s.goals.targetCountries);
        return Array.from(new Set(allTargets)).sort();
    }, []);
    // Filter and Sort Students
    const processedStudents = useMemo(() => {
        // 1. Filter
        let filtered = MOCK_STUDENTS.filter((student) => {
            const nameMatch = student.name.toLowerCase().includes(searchDebounced.toLowerCase());
            const uniMatch = student.university.toLowerCase().includes(searchDebounced.toLowerCase());
            const degreeMatch = student.goals.targetDegree.toLowerCase().includes(searchDebounced.toLowerCase());
            const interestMatch = student.interests.some((interest) =>
                interest.toLowerCase().includes(searchDebounced.toLowerCase())
            );
            const matchesSearch = nameMatch || uniMatch || degreeMatch || interestMatch;
            const matchesCurrentCountry = !currentCountryFilter || student.country === currentCountryFilter;

            const matchesTargetCountry =
                !targetCountryFilter || student.goals.targetCountries.includes(targetCountryFilter);
            const matchesInterest =
                !interestFilter ||
                student.interests.some((interest) =>
                    interest.toLowerCase().includes(interestFilter.toLowerCase())
                );
            let matchesMyCountryFilter = true;
            if (matchMyCountry && mentorProfile) {
                matchesMyCountryFilter = student.goals.targetCountries.includes(mentorProfile.country);
            }
            return (
                matchesSearch &&
                matchesCurrentCountry &&
                matchesTargetCountry &&
                matchesInterest &&
                matchesMyCountryFilter
            );
        });
        // 2. Sort: prioritized by whether student targets the mentor's country, then name
        return [...filtered].sort((a, b) => {
            if (mentorProfile) {
                const aMatchesTarget = a.goals.targetCountries.includes(mentorProfile.country) ? 1 : 0;
                const bMatchesTarget = b.goals.targetCountries.includes(mentorProfile.country) ? 1 : 0;
                if (aMatchesTarget !== bMatchesTarget) {
                    return bMatchesTarget - aMatchesTarget; // matching country comes first
                }
            }
            // Default sorting: name ascending
            return a.name.localeCompare(b.name);
        });
    }, [searchDebounced, currentCountryFilter, targetCountryFilter, interestFilter, matchMyCountry, mentorProfile]);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(processedStudents.length / itemsPerPage);
    const currentStudents = processedStudents.slice(
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
        setCurrentCountryFilter("");
        setTargetCountryFilter("");
        setInterestFilter("");
        setMatchMyCountry(false);
        setCurrentPage(1);
    };
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <MainNavbar />
            <main className="flex-grow pt-16 pb-20">
                {/* Filters Section */}
                <section className="px-8 mb-12 max-w-7xl mx-auto">
                    <div className="bg-slate-50 p-2 rounded-xl flex flex-col lg:flex-row gap-2 border border-slate-100 shadow-sm bg-white">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-elm" />
                            <input
                                className="w-full pl-13 pr-5 py-5 bg-transparent border-none rounded-lg focus:ring-0 outline-none text-codgray"
                                placeholder="Search students by name, degree, or interests..."
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
                                    value={currentCountryFilter}
                                    onChange={(e) => {
                                        setCurrentCountryFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">Home Country</option>
                                    {currentCountryOptions.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
                            </div>
                            <div className="relative group flex-1 sm:flex-initial">
                                <select
                                    className="appearance-none w-full sm:w-48 bg-transparent border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium outline-none cursor-pointer"
                                    value={targetCountryFilter}
                                    onChange={(e) => {
                                        setTargetCountryFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">Target Country</option>
                                    {targetCountryOptions.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
                            </div>
                            {/* Personalization Toggle */}
                            {mentorProfile && (
                                <div className="flex items-center gap-3 px-6 py-3 sm:py-0 border-t sm:border-t-0 sm:border-l border-slate-100">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={matchMyCountry}
                                            onChange={(e) => {
                                                setMatchMyCountry(e.target.checked);
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
                                        <span className="ml-3 text-sm font-semibold text-slate-700 whitespace-nowrap">
                                            Targeting My Country ({mentorProfile.countryFlag})
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Popular / Quick Filter Tags */}
                    <div className="flex flex-wrap gap-3 mt-6 items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-bombay pr-2">Interests:</span>
                        {popularInterestTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => {
                                    setInterestFilter(interestFilter === tag ? "" : tag);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center border ${interestFilter === tag
                                    ? "bg-elm/10 text-elm border-elm/20 hover:bg-elm/20"
                                    : "bg-white border-slate-200 text-codgray hover:bg-slate-50"
                                    }`}
                            >
                                {tag}
                                {interestFilter === tag && <X className="w-3.5 h-3.5 ml-1.5" />}
                            </button>
                        ))}
                    </div>
                </section>
                {/* Students Grid Section */}
                <section className="px-8 max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                        <h2 className="text-2xl font-extrabold text-slate-800">
                            {matchMyCountry ? `Students targeting ${mentorProfile?.country}` : "All Students"}
                        </h2>
                        <span className="text-sm font-semibold text-slate-500">
                            Showing {processedStudents.length} student{processedStudents.length !== 1 && "s"}
                        </span>
                    </div>
                    {currentStudents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentStudents.map((student) => {
                                const isMatch = mentorProfile ? student.goals.targetCountries.includes(mentorProfile.country) : false;
                                return (
                                    <StudentCard
                                        key={student.username}
                                        student={student}
                                        isMatch={isMatch}
                                        matchingCountry={mentorProfile?.country}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-xl mx-auto px-6">
                            <p className="text-lg font-bold text-slate-700">No students match your current criteria</p>
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
export default function StudentsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-elm mb-4" />
                    <p className="text-bombay font-semibold">Preparing students...</p>
                </div>
            }
        >
            <StudentList />
        </Suspense>
    );
}
