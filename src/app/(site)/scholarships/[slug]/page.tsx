import { getScholarshipBySlug, type PublicScholarship } from "@/lib/api";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import SaveScholarshipButton from "@/components/scholarships/SaveScholarshipButton";
import {
    MapPin,
    GraduationCap,
    CalendarClock,
    CheckCircle2,
    ChevronRight,
    ExternalLink,
    Award,
    FileText,
    HelpCircle,
    ListOrdered
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

function formatDeadline(deadline: string | null) {
    if (!deadline) return "Ongoing";

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(deadline));
}

function formatEnum(value: string) {
    return value
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function parseList(value: string) {
    return value
        .split("\n")
        .map((line) => line.replace(/^[\s\d\-•*.:·–—+]+/, "").trim())
        .filter(Boolean);
}

function getCoverageDetails(scholarship: PublicScholarship) {
    const details = [
        `${formatEnum(scholarship.coverage)} scholarship coverage`,
    ];

    if (scholarship.amount) {
        details.push(`Amount / stipend: ${scholarship.amount}`);
    }

    if (scholarship.category) {
        details.push(`Category: ${scholarship.category}`);
    }

    details.push(`Provider: ${scholarship.provider}`);

    return details;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const scholarship = await getScholarshipBySlug(slug);

    const title = scholarship ? `${scholarship.name} | Agaaw Scholar` : "Scholarship Details";

    return {
        title,
        description:
            scholarship?.description ??
            "Detailed information about this scholarship on Agaaw Scholar.",
    };
}

export default async function ScholarshipDetails({ params }: PageProps) {
    const { slug } = await params;
    const scholarship = await getScholarshipBySlug(slug);

    if (!scholarship) {
        notFound();
    }

    const deadline = formatDeadline(scholarship.deadline);
    const coverageDetails = getCoverageDetails(scholarship);
    const benefits = parseList(scholarship.benefits || "");
    const eligibility = parseList(scholarship.eligibility || "");
    const requiredDocuments = parseList(scholarship.requiredDocuments);
    const applicationSteps = parseList(scholarship.howToApply);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <MainNavbar />

            {/* Hero Section */}
            <div className="bg-teal-900 border-b border-teal-800 text-white pt-20 pb-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <Link href="/scholarships" className="inline-flex items-center text-teal-200 hover:text-white mb-8 transition-colors text-sm font-medium">
                        <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                        Back to Scholarships
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-between">
                        <div className="flex-1">
                            <span className="inline-block px-4 py-1.5 bg-teal-800/50 text-teal-100 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-teal-700/50">
                                {scholarship.provider}
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white min-h-[4rem]">
                                {scholarship.name}
                            </h1>
                            <p className="text-lg md:text-xl text-teal-50 max-w-3xl leading-relaxed font-light">
                                {scholarship.description}
                            </p>
                        </div>

                        {/* Meta Info Box */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 w-full md:w-[380px] shrink-0 mt-4 md:mt-0 shadow-xl shadow-teal-950/20">
                            <h3 className="text-xs font-bold text-teal-200 uppercase tracking-widest mb-5">Quick Details</h3>
                            <ul className="space-y-5">
                                <li className="flex items-center gap-4">
                                    <div className="bg-white/10 p-2.5 rounded-xl"><MapPin className="w-5 h-5 text-teal-200" /></div>
                                    <div>
                                        <p className="text-[11px] font-semibold tracking-wider text-teal-300 uppercase mb-0.5">Location</p>
                                        <p className="font-medium text-white">{scholarship.country}</p>
                                    </div>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="bg-white/10 p-2.5 rounded-xl"><GraduationCap className="w-5 h-5 text-teal-200" /></div>
                                    <div>
                                        <p className="text-[11px] font-semibold tracking-wider text-teal-300 uppercase mb-0.5">Level</p>
                                        <p className="font-medium text-white">
                                            {Array.isArray(scholarship.level)
                                                ? scholarship.level.map(l => formatEnum(l)).join(", ")
                                                : formatEnum(scholarship.level as any)}
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="bg-white/10 p-2.5 rounded-xl"><CalendarClock className="w-5 h-5 text-teal-200" /></div>
                                    <div>
                                        <p className="text-[11px] font-semibold tracking-wider text-teal-300 uppercase mb-0.5">Deadline</p>
                                        <p className="font-medium text-white">{deadline}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 -mt-10 mb-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left Column (Details) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Coverage Card */}
                        <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                            <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                <div className="bg-emerald-100 p-3 rounded-2xl">
                                    <Award className="w-7 h-7 text-emerald-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Coverage Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {coverageDetails.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 bg-slate-50 hover:bg-slate-100/80 transition-colors p-5 rounded-2xl border border-slate-100">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <span className="text-slate-700 leading-relaxed text-sm md:text-base font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {benefits.length > 0 && (
                            <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                    <div className="bg-emerald-100 p-3 rounded-2xl">
                                        <CheckCircle2 className="w-7 h-7 text-emerald-700" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Benefits</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex gap-3 bg-slate-50 hover:bg-slate-100/80 transition-colors p-5 rounded-2xl border border-slate-100">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                            <span className="text-slate-700 leading-relaxed text-sm md:text-base font-medium">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {eligibility.length > 0 && (
                            <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                    <div className="bg-amber-100 p-3 rounded-2xl">
                                        <Award className="w-7 h-7 text-amber-700" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Eligibility</h2>
                                </div>
                                <ul className="space-y-4">
                                    {eligibility.map((item, idx) => (
                                        <li key={idx} className="flex gap-4 items-start p-4 hover:bg-slate-50 transition-colors rounded-xl">
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 mt-2 shadow-sm"></div>
                                            <p className="text-slate-700 leading-relaxed font-medium flex-1">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Required Documents Card */}
                        <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                            <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                <div className="bg-amber-100 p-3 rounded-2xl">
                                    <FileText className="w-7 h-7 text-amber-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Required Documents</h2>
                            </div>
                            <ul className="space-y-4">
                                {requiredDocuments.map((item, idx) => (
                                    <li key={idx} className="flex gap-4 items-start p-4 hover:bg-slate-50 transition-colors rounded-xl">
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 mt-2 shadow-sm"></div>
                                        <p className="text-slate-700 leading-relaxed font-medium flex-1">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Application Steps Card */}
                        <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                            <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
                                <div className="bg-blue-100 p-3 rounded-2xl">
                                    <ListOrdered className="w-7 h-7 text-blue-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Application Steps</h2>
                            </div>

                            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.1rem] md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-blue-200 before:via-blue-200 before:to-transparent">
                                {applicationSteps.map((step, idx) => (
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

                        {scholarship.faqs && scholarship.faqs.length > 0 && (
                            <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                    <div className="bg-teal-100 p-3 rounded-2xl">
                                        <HelpCircle className="w-7 h-7 text-teal-700" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Frequently Asked Questions</h2>
                                </div>
                                <div className="space-y-4">
                                    {scholarship.faqs.map((faq) => (
                                        <div key={faq.question} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                                            <h3 className="font-bold text-slate-800 mb-2">{faq.question}</h3>
                                            <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column (Sidebar CTA) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center">
                            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ExternalLink className="w-8 h-8 text-teal-600 ml-1" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">Ready to Apply?</h3>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                Review the official guidelines and submit your application before the final deadline on <span className="font-bold text-slate-800">{deadline}</span>.
                            </p>
                            {scholarship.officialLink ? (
                                <>
                                    <a
                                        href={scholarship.officialLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-teal-600/25 active:scale-[0.98]"
                                    >
                                        Official Website <ChevronRight className="w-5 h-5" />
                                    </a>
                                    <p className="text-xs text-slate-400 mt-5 font-medium">Opens safely in a new tab</p>
                                </>
                            ) : (
                                <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                                    Official application link will be added soon.
                                </p>
                            )}
                            <SaveScholarshipButton scholarshipId={scholarship.id} />
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
