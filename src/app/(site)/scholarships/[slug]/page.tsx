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
        .map((line) => line.replace(/^[\s\d\-•*.:·–—+]+/, "").trim())
        .map((line) => line.replace(/^[\s\d\-•*.:·–—+]+/, "").trim())
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
                            <span className="inline-block px-4 py-1.5 bg-teal-800/50 text-teal-100 rounded-full text-sm font-bold tracking-widest uppercase mb-6 border border-teal-700/50">
                                {scholarship.provider}
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white min-h-[4rem]">
                                {scholarship.name}
                            </h1>
                            <p className="text-sm md:text-xl text-teal-50 max-w-3xl leading-relaxed font-light">
                                {scholarship.description}
                            </p>
                        </div>

                        {/* Meta Info Box */}
                        <div className="bg-white/10 backdrop-blur-md rounded-4xl p-20 border border-white/10 w-full md:w-auto md:min-w-[350px] shrink-0 mt-4 md:mt-0 shadow-xl shadow-teal-950/20">
                            <h3 className="text-md font-bold text-teal-200 uppercase tracking-widest mb-5">Quick Details</h3>
                            <ul className="space-y-7">
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
            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 -mt-10 mb-20 relative z-10">
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
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50">
                                            <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/3">Detail / Topic</th>
                                            <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Information</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
                                            <td className="py-4 px-4 text-sm font-semibold text-slate-700 align-top">Coverage</td>
                                            <td className="py-4 px-4 text-sm text-slate-600 leading-relaxed align-top">{formatEnum(scholarship.coverage)}</td>
                                        </tr>
                                        {scholarship.amount && (
                                            <tr className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
                                                <td className="py-4 px-4 text-sm font-semibold text-slate-700 align-top">Amount / Stipend</td>
                                                <td className="py-4 px-4 text-sm text-slate-600 leading-relaxed align-top">{scholarship.amount}</td>
                                            </tr>
                                        )}
                                        {scholarship.category && (
                                            <tr className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
                                                <td className="py-4 px-4 text-sm font-semibold text-slate-700 align-top">Category</td>
                                                <td className="py-4 px-4 text-sm text-slate-600 leading-relaxed align-top">{scholarship.category}</td>
                                            </tr>
                                        )}
                                        <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                                            <td className="py-4 px-4 text-sm font-semibold text-slate-700 align-top">Provider</td>
                                            <td className="py-4 px-4 text-sm text-slate-600 leading-relaxed align-top">{scholarship.provider}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Benefits Card */}
                        {benefits.length > 0 && (
                            <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                    <div className="bg-emerald-100 p-3 rounded-2xl">
                                        <CheckCircle2 className="w-7 h-7 text-emerald-700" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Benefits</h2>
                                </div>
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-12">Status</th>
                                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Benefit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {benefits.map((benefit, idx) => (
                                                <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                                                    <td className="py-4 px-4 align-top w-12">
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                    </td>
                                                    <td className="py-4 px-4 text-slate-700 leading-relaxed text-sm font-medium">
                                                        {benefit}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        {/* Eligibility Card */}
                        {eligibility.length > 0 && (
                            <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                    <div className="bg-amber-100 p-3 rounded-2xl">
                                        <Award className="w-7 h-7 text-amber-700" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Eligibility</h2>
                                </div>
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-12">Status</th>
                                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Eligibility Criteria</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {eligibility.map((item, idx) => (
                                                <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                                                    <td className="py-4 px-4 align-top w-12">
                                                        <CheckCircle2 className="w-5 h-5 text-amber-500" />
                                                    </td>
                                                    <td className="py-4 px-4 text-slate-700 leading-relaxed text-sm font-medium">
                                                        {item}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        {/* Required Documents Card */}
                        {requiredDocuments.length > 0 && (
                            <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                    <div className="bg-amber-100 p-3 rounded-2xl">
                                        <FileText className="w-7 h-7 text-amber-700" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Required Documents</h2>
                                </div>
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-12">Required</th>
                                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Document Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requiredDocuments.map((item, idx) => (
                                                <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                                                    <td className="py-4 px-4 align-top w-12">
                                                        <FileText className="w-5 h-5 text-amber-600" />
                                                    </td>
                                                    <td className="py-4 px-4 text-slate-700 leading-relaxed text-sm font-medium">
                                                        {item}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        {/* Application Steps Card */}
                        {applicationSteps.length > 0 && (
                            <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                                <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
                                    <div className="bg-blue-100 p-3 rounded-2xl">
                                        <ListOrdered className="w-7 h-7 text-blue-700" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Application Steps</h2>
                                </div>
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-24">Step</th>
                                                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Action / Process Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applicationSteps.map((step, idx) => (
                                                <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-4 px-4 align-top w-24">
                                                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-500 text-blue-700 font-bold text-sm">
                                                            {idx + 1}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-slate-700 leading-relaxed text-sm font-medium align-middle">
                                                        {step}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

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
