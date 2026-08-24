import { getCountryBySlug } from "@/lib/api";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import QuickDetailsBox from "@/components/countries/QuickDetailsBox";
import {
    Banknote,
    CalendarClock,
    CheckCircle2,
    ChevronRight,
    Globe,
    Award,
    ListOrdered,
    Library,
    Briefcase,
    AlertTriangle,
    GraduationCap,
    ClipboardCheck
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
    const data = await getCountryBySlug(country.toLowerCase());

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
    const data = await getCountryBySlug(country.toLowerCase());

    if (!data) {
        notFound();
    }

    // Resolve Tuition Fees details (checking sections array first, then fallback to tuitionCost field)
    const tuitionFeesContent = (data as any).tuitionFeesDetails ||
        (data as any).sections?.find((s: any) => s.sectionKey === "tuition_fees")?.content ||
        data.tuitionCost ||
        "";

    // Resolve Application Deadlines / Intake Periods
    const whenToApplyContent = data.whenToApply ||
        (data as any).sections?.find((s: any) => s.sectionKey === "when_to_apply")?.content ||
        "";

    // Resolve Visa Documents
    const visaPolicyContent = data.visaPolicy ||
        (data as any).sections?.find((s: any) => s.sectionKey === "visa_documents" || s.sectionKey === "visa_policy")?.content ||
        "";

    // Helper to parse line breaks and standard bullet points into clean lists
    const parseTextToList = (text?: string | null,
        removeNumbers: boolean = true
    ): string[] => {
        if (!text) return [];

        const regex = removeNumbers
            ? /^[\s•\-\*\d+\.\:\)]+/
            : /^[\s•\-\*]+/;

        return text
            .split(/\n+/)
            .map(line => line.replace(regex, "").trim())
            .filter(line => line.length > 0);
    };

    // Resolve Admission details
    const admissionContent = (data as any).sections?.find((s: any) => s.sectionKey === "admission")?.content || "";
    const admissionList = parseTextToList(admissionContent);

    // Resolve Test Scores details
    const testScoresContent = (data as any).sections?.find((s: any) => s.sectionKey === "test_scores")?.content || "";
    const testScoresList = parseTextToList(testScoresContent);

    const parseTestScore = (item: string) => {
        const colonIndex = item.indexOf(":");
        if (colonIndex > -1) {
            return {
                name: item.substring(0, colonIndex).trim(),
                score: item.substring(colonIndex + 1).trim()
            };
        }
        return {
            name: item,
            score: ""
        };
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <MainNavbar />

            {/* Hero Section */}
            <div className="bg-teal-900 border-b border-teal-800 text-white pt-20 pb-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <Link href="/countries" className="inline-flex items-center text-teal-200 hover:text-white mb-8 transition-colors text-sm font-medium">
                        <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                        Back to Countries
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white min-h-[4rem]">
                                Study in {data.name}
                            </h1>
                            <p className="text-lg md:text-xl text-teal-50 max-w-3xl leading-relaxed font-light">
                                {data.shortIntro}
                            </p>
                        </div>

                        <QuickDetailsBox
                            tuitionCost={data.tuitionCost || (tuitionFeesContent ? parseTextToList(tuitionFeesContent)[0] : undefined)}
                            currency={data.currency}
                            language={data.language}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 -mt-10 mb-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Scholarships Overview (spans 2 on desktop) */}
                    {data.scholarshipsOverview && data.scholarshipsOverview.trim() !== "" && (
                        <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 lg:col-span-2">
                            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-6">
                                <div className="bg-violet-100 p-3 rounded-2xl">
                                    <GraduationCap className="w-7 h-7 text-violet-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Scholarships Overview</h2>
                            </div>
                            <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line">
                                {data.scholarshipsOverview}
                            </p>
                        </section>
                    )}

                    {/* Opportunities & Cons Card (spans 2 on desktop) */}
                    <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Opportunities (Pros) */}
                            <div>
                                <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                                    <div className="bg-emerald-100 p-2.5 rounded-xl">
                                        <Award className="w-6 h-6 text-emerald-700" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Opportunities & Benefits</h2>
                                </div>
                                {data.opportunities && data.opportunities.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.opportunities.map((item: string, idx: number) => (
                                            <div key={idx} className="flex gap-3 bg-slate-50 hover:bg-slate-100/80 transition-colors p-4 rounded-xl border border-slate-100">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                                <span className="text-slate-700 leading-relaxed text-sm font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-sm">No opportunities listed.</p>
                                )}
                            </div>

                            {/* Challenges (Cons) */}
                            <div>
                                <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                                    <div className="bg-rose-100 p-2.5 rounded-xl">
                                        <AlertTriangle className="w-6 h-6 text-rose-700" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Challenges & Cons</h2>
                                </div>
                                {data.cons && data.cons.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.cons.map((item: string, idx: number) => (
                                            <div key={idx} className="flex gap-3 bg-slate-50 hover:bg-slate-100/80 transition-colors p-4 rounded-xl border border-slate-100">
                                                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                                <span className="text-slate-700 leading-relaxed text-sm font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-sm">No cons listed.</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Admission & Requirements Card (spans 2 on desktop) */}
                    <section className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 lg:col-span-2">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <ClipboardCheck className="w-5 h-5 text-orange-500" />
                                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Requirements</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-8">Admission & requirements</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                {/* Admission Column */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 border-b border-slate-100 pb-3">Admission</h3>
                                    {admissionList.length > 0 ? (
                                        <ul className="space-y-4">
                                            {admissionList.map((item, idx) => (
                                                <li key={idx} className="flex gap-3 items-start">
                                                    <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                                    <span className="text-slate-600 leading-relaxed text-sm font-medium">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-slate-400 text-sm">No admission requirements listed.</p>
                                    )}
                                </div>

                                {/* Language Scores Column */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 border-b border-slate-100 pb-3">Language scores</h3>
                                    {testScoresList.length > 0 ? (
                                        <div className="space-y-4">
                                            {testScoresList.map((item, idx) => {
                                                const parsed = parseTestScore(item);
                                                return (
                                                    <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 flex justify-between items-center shadow-sm hover:bg-slate-50/80 transition-colors duration-200">
                                                        <span className="font-bold text-slate-800 text-sm">{parsed.name}</span>
                                                        {parsed.score && (
                                                            <span className="text-sm font-semibold text-orange-500">{parsed.score}</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-slate-400 text-sm">No language scores requirements listed.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Visa Documents Card (spans 2 on desktop) */}
                    <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 lg:col-span-2">
                        <div>
                            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                                <div className="bg-teal-100 p-2.5 rounded-xl">
                                    <Globe className="w-6 h-6 text-teal-700" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Visa Documents</h2>
                            </div>
                            {visaPolicyContent && visaPolicyContent.trim() !== "" ? (
                                <div className="space-y-3">
                                    {parseTextToList(visaPolicyContent).map((item: string, idx: number) => (
                                        <div key={idx} className="flex gap-3 bg-slate-50 hover:bg-slate-100/80 transition-colors p-4 rounded-xl border border-slate-100">
                                            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                                            <span className="text-slate-700 leading-relaxed text-sm font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm">No visa documents listed.</p>
                            )}
                        </div>
                    </section>

                    {/* Costs & Tuition Fees Card (spans 2 on desktop) */}
                    <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Living Cost */}
                            <div>
                                <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                                    <div className="bg-teal-100 p-2.5 rounded-xl">
                                        <Banknote className="w-6 h-6 text-teal-700" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Living Cost</h2>
                                </div>
                                {data.avgCost && data.avgCost.trim() !== "" ? (
                                    <div className="space-y-3">
                                        {parseTextToList(data.avgCost).map((item: string, idx: number) => (
                                            <div key={idx} className="flex gap-3 bg-slate-50 hover:bg-slate-100/80 transition-colors p-4 rounded-xl border border-slate-100">
                                                <Banknote className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                                                <span className="text-slate-700 leading-relaxed text-sm font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-sm">No living cost details listed.</p>
                                )}
                            </div>

                            {/* Tuition Fees */}
                            <div>
                                <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                                    <div className="bg-violet-100 p-2.5 rounded-xl">
                                        <GraduationCap className="w-6 h-6 text-violet-700" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Tuition Fees</h2>
                                </div>
                                {tuitionFeesContent && tuitionFeesContent.trim() !== "" ? (
                                    <div className="space-y-3">
                                        {parseTextToList(tuitionFeesContent).map((item: string, idx: number) => (
                                            <div key={idx} className="flex gap-3 bg-slate-50 hover:bg-slate-100/80 transition-colors p-4 rounded-xl border border-slate-100">
                                                <GraduationCap className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                                                <span className="text-slate-700 leading-relaxed text-sm font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-sm">No tuition fee details listed.</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Application Deadlines Card (spans 2 on desktop) */}
                    {whenToApplyContent && whenToApplyContent.trim() !== "" && (
                        <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 lg:col-span-2">
                            <div>
                                <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                                    <div className="bg-blue-100 p-2.5 rounded-xl">
                                        <CalendarClock className="w-6 h-6 text-blue-700" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Application Deadlines</h2>
                                </div>
                                <div className="space-y-3">
                                    {parseTextToList(whenToApplyContent).map((item: string, idx: number) => (
                                        <div key={idx} className="flex gap-3 bg-slate-50 hover:bg-slate-100/80 transition-colors p-4 rounded-xl border border-slate-100">
                                            <CalendarClock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                            <span className="text-slate-700 leading-relaxed text-sm font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Work Rights & Regulations Card (1 column in 50/50 split) */}
                    <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between min-h-[300px]">
                        <div>
                            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                                <div className="bg-amber-100 p-2.5 rounded-xl">
                                    <Briefcase className="w-6 h-6 text-amber-700" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Work Rights & Regulations</h2>
                            </div>
                            {data.workRights && data.workRights.trim() !== "" ? (
                                <ul className="space-y-3">
                                    {parseTextToList(data.workRights, false).map((item: string, idx: number) => (
                                        <li key={idx} className="flex gap-3 bg-slate-50 hover:bg-slate-100/80 transition-colors p-4 rounded-xl border border-slate-100">
                                            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                            <span className="text-slate-700 leading-relaxed text-sm font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-400 text-sm">No work regulations listed.</p>
                            )}
                        </div>
                    </section>

                    {/* Top Universities Card (spans 2 on desktop) */}
                    {data.universities && data.universities.length > 0 && (
                        <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 lg:col-span-2">
                            <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                <div className="bg-indigo-100 p-3 rounded-2xl">
                                    <Library className="w-7 h-7 text-indigo-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Top Universities in {data.name}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {data.universities.map((item: string, idx: number) => (
                                    <div key={idx} className="flex gap-4 items-center p-4 hover:bg-slate-50 transition-all duration-200 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-sm">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                            <Library className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <p className="text-slate-700 text-sm font-semibold flex-1 line-clamp-2">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* How to Apply Card (spans 2 on desktop) */}
                    {data.howToApply && data.howToApply.length > 0 && (
                        <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 lg:col-span-2">
                            <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
                                <div className="bg-blue-100 p-3 rounded-2xl">
                                    <ListOrdered className="w-7 h-7 text-blue-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">How to Apply</h2>
                            </div>

                            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.1rem] md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-blue-200 before:via-blue-200 before:to-transparent">
                                {data.howToApply.map((step: string, idx: number) => (
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
                    )}

                    {/* Looking for Scholarships? (CTA Card) - spans 2 at the bottom */}
                    <section className="bg-teal-900 border border-teal-800 rounded-3xl p-10 lg:col-span-2 text-white relative overflow-hidden shadow-xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.1),transparent)] pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
                            <div className="text-center md:text-left">
                                <span className="inline-block bg-teal-500/20 text-teal-300 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                                    Take Action
                                </span>
                                <h3 className="text-3xl font-extrabold mb-3 tracking-tight">Looking for Scholarships?</h3>
                                <p className="text-teal-200 text-base max-w-xl leading-relaxed">
                                    Discover fully funded and partially funded opportunities in <span className="font-bold text-white">{data.name}</span> and start your application process today.
                                </p>
                            </div>
                            <div className="shrink-0 w-full md:w-auto">
                                <Link
                                    href={`/scholarships?country=${data.slug}`}
                                    className="flex items-center justify-center gap-2 w-full md:w-auto bg-white hover:bg-teal-50 text-teal-900 text-lg font-bold py-4 px-8 rounded-2xl transition-all shadow-lg active:scale-[0.98] border border-white hover:shadow-teal-900/30"
                                >
                                    Find Scholarships <ChevronRight className="w-5 h-5 text-teal-900" />
                                </Link>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
