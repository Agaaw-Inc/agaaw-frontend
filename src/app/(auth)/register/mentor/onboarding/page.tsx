"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    GraduationCap,
    MapPin,
    Phone,
    BookOpen,
    ChevronDown,
    ArrowRight,
    ArrowLeft,
    Plus,
    Trash2,
    Clock,
    DollarSign,
    Bell,
    User,
    Briefcase,
    CheckCircle,
    Loader2,
} from "lucide-react";
import { PHONE_CODES, COUNTRY_LIST } from "@/data/geo";
import { completeMentorOnboarding, getCountriesClient } from "@/lib/api";

interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    currency: string;
    duration: string;
}

const SEMESTER_OPTIONS = [
    { label: "Sem 1", value: "semester_1" },
    { label: "Sem 2", value: "semester_2" },
    { label: "Sem 3", value: "semester_3" },
    { label: "Sem 4", value: "semester_4" },
    { label: "Sem 5+", value: "semester_5plus" },
    { label: "Graduated", value: "graduated" },
    { label: "Alumni", value: "alumni" },
];
const EDUCATION_LEVELS = [
    "Bachelor's Degree",
    "Master's Degree",
    "PhD / Doctorate",
    "Postdoctoral",
];
const DEFAULT_SERVICES: Service[] = [
    {
        id: 1,
        title: "Document Review",
        description: "Thorough review of your SOP, LOR, or CV with detailed feedback.",
        price: 40,
        currency: "$",
        duration: "45 min",
    },
    {
        id: 2,
        title: "Full Application Process",
        description: "End-to-end guidance from university selection to final submission.",
        price: 150,
        currency: "$",
        duration: "3 sessions",
    },
];
export default function MentorOnboarding() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    // --- Step 1: Academic & Basic Info ---
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [university, setUniversity] = useState("");
    const [subject, setSubject] = useState("");
    const [educationLevel, setEducationLevel] = useState("");
    const [semester, setSemester] = useState("");
    const [phoneCode, setPhoneCode] = useState("+880");
    const [phoneNumber, setPhoneNumber] = useState("");
    // --- Step 2: Services ---
    const [hourlyRate, setHourlyRate] = useState("");
    const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newDuration, setNewDuration] = useState("");
    const [addingService, setAddingService] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [backendCountries, setBackendCountries] = useState<any[]>([]);

    // Load backend countries for ID resolution
    useEffect(() => {
        getCountriesClient()
            .then((countries: any[]) => setBackendCountries(countries))
            .catch((err: any) => console.error("Failed to fetch countries:", err));
    }, []);

    // Load saved progress
    useEffect(() => {
        const saved = localStorage.getItem("mentor_onboarding_data");
        if (saved) {
            try {
                const p = JSON.parse(saved);
                if (p.step) setStep(p.step);
                if (p.country) setCountry(p.country);
                if (p.city) setCity(p.city);
                if (p.university) setUniversity(p.university);
                if (p.subject) setSubject(p.subject);
                if (p.educationLevel) setEducationLevel(p.educationLevel);
                if (p.semester) setSemester(p.semester);
                if (p.phoneCode) setPhoneCode(p.phoneCode);
                if (p.phoneNumber) setPhoneNumber(p.phoneNumber);
                if (p.hourlyRate) setHourlyRate(p.hourlyRate);
                if (p.services) setServices(p.services);
            } catch (e) {
                console.error("Failed to load mentor onboarding data", e);
            }
        }
    }, []);
    const saveProgress = (nextStep: number) => {
        const data = {
            step: nextStep, country, city, university, subject, educationLevel,
            semester, phoneCode, phoneNumber, hourlyRate, services,
        };
        localStorage.setItem("mentor_onboarding_data", JSON.stringify(data));
        setStep(nextStep);
    };
    const handleNext = async () => {
        if (step < 2) {
            saveProgress(step + 1);
        } else {
            setIsSubmitting(true);
            setSubmitError("");
            try {
                const matchedCountry = backendCountries.find(
                    (c: any) => c.name?.toLowerCase() === country.toLowerCase()
                );

                const payload: Record<string, unknown> = {
                    countryName: country || undefined,
                    countryId: matchedCountry?.id || undefined,
                    cityName: city || undefined,
                    currentUniversity: university || undefined,
                    subject: subject || undefined,
                    degree: educationLevel || undefined,
                    semester: semester || undefined,
                    phone: phoneNumber ? `${phoneCode}${phoneNumber}` : undefined,
                    hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
                    services: services.length > 0 ? services : undefined,
                };
                // Remove undefined values
                Object.keys(payload).forEach((key) => {
                    if (payload[key] === undefined) delete payload[key];
                });
                await completeMentorOnboarding(payload);
                localStorage.removeItem("mentor_onboarding_data");
                localStorage.setItem("mentor_onboarding_completed", "true");
                router.push("/dashboard/mentor");
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Failed to save profile. Please try again.";
                setSubmitError(message);
            } finally {
                setIsSubmitting(false);
            }
        }
    };
    const handleBack = () => {
        if (step > 1) saveProgress(step - 1);
    };
    // Service Management
    const handleAddService = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newPrice || !newDuration) return;
        const svc: Service = {
            id: Date.now(),
            title: newTitle.trim(),
            description: newDesc.trim() || "No description provided.",
            price: Number(newPrice),
            currency: "$",
            duration: newDuration.trim(),
        };
        setServices([...services, svc]);
        setNewTitle(""); setNewDesc(""); setNewPrice(""); setNewDuration("");
        setAddingService(false);
    };
    const handleRemoveService = (id: number) => {
        setServices(services.filter((s) => s.id !== id));
    };
    const step1Valid = country && university && educationLevel && semester;
    const step2Valid = hourlyRate && services.length > 0;
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="bg-[#005F59] text-white p-1.5 rounded-lg">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg text-slate-900 tracking-tight">Agaaw</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-500">
                        Step {step} of 2
                    </span>
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                    </button>
                    <div className="h-8 w-8 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700">
                        <User className="h-4 w-4" />
                    </div>
                </div>
            </header>
            <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
                {/* Page title & progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mentor Onboarding</h1>
                            <p className="text-sm text-slate-500 mt-1">
                                {step === 1 ? "Step 1: Academic & Basic Information" : "Step 2: Your Services & Pricing"}
                            </p>
                        </div>
                        <span className="text-xs font-extrabold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full">
                            Step {step} of 2
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                        <div
                            className={`h-full rounded-full transition-all duration-500 bg-[#005F59] ${step >= 1 ? "flex-1" : "w-0"}`}
                        />
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${step >= 2 ? "flex-1 bg-[#005F59]" : "flex-1 bg-slate-100"}`}
                        />
                    </div>
                </div>
                {/* ================================================================ */}
                {/* STEP 1: Academic & Basic Info */}
                {/* ================================================================ */}
                {step === 1 && (
                    <div className="space-y-5">
                        {/* Regional Context */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                                <MapPin className="h-4 w-4 text-teal-600" />
                                <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Regional Context</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Country */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">
                                        Current Country
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 font-semibold transition-all"
                                        >
                                            <option value="">Select Country</option>
                                            {COUNTRY_LIST.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                {/* City */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">City</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Dhaka"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 font-semibold placeholder:font-normal placeholder:text-slate-400 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Academic Credentials */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                                <GraduationCap className="h-4 w-4 text-teal-600" />
                                <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Academic Credentials</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* University Name */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">University Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full name of your institution"
                                        value={university}
                                        onChange={(e) => setUniversity(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 font-semibold placeholder:font-normal placeholder:text-slate-400 transition-all"
                                    />
                                </div>
                                {/* Subject/Major & Education Level */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Subject / Major</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Computer Science"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 font-semibold placeholder:font-normal placeholder:text-slate-400 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Education Level</label>
                                        <div className="relative">
                                            <select
                                                value={educationLevel}
                                                onChange={(e) => setEducationLevel(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 font-semibold transition-all"
                                            >
                                                <option value="">Select Level</option>
                                                {EDUCATION_LEVELS.map((l) => (
                                                    <option key={l} value={l}>{l}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                                {/* Current Semester */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Current Semester / Status</label>
                                    <div className="flex flex-wrap gap-2">
                                        {SEMESTER_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setSemester(opt.value)}
                                                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${semester === opt.value
                                                    ? "bg-[#005F59] text-white border-[#005F59] shadow-md shadow-teal-900/10"
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-700"
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Communication */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                                <Phone className="h-4 w-4 text-teal-600" />
                                <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Communication</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Phone Number</label>
                                    <div className="flex gap-2">
                                        <div className="relative w-36 shrink-0">
                                            <select
                                                value={phoneCode}
                                                onChange={(e) => setPhoneCode(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm appearance-none focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 font-semibold"
                                            >
                                                {PHONE_CODES.map((p) => (
                                                    <option key={p.country} value={p.code}>{p.label}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="01XXX-XXXXXX"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 font-semibold placeholder:font-normal placeholder:text-slate-400 transition-all"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-400">Verification code may be sent to this number.</p>
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!step1Valid}
                                className="flex items-center gap-2 bg-[#005F59] hover:bg-teal-800 active:scale-[0.98] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md shadow-teal-900/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                            >
                                Next Step <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
                {/* ================================================================ */}
                {/* STEP 2: Services & Pricing */}
                {/* ================================================================ */}
                {step === 2 && (
                    <div className="space-y-5">
                        {/* Hourly Rate */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                                <DollarSign className="h-4 w-4 text-teal-600" />
                                <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Base Hourly Rate</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">
                                        Your hourly consultation rate (USD)
                                    </label>
                                    <div className="relative max-w-xs">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">$</span>
                                        <input
                                            type="number"
                                            placeholder="e.g. 50"
                                            value={hourlyRate}
                                            min={1}
                                            onChange={(e) => setHourlyRate(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 font-bold placeholder:font-normal placeholder:text-slate-400 transition-all"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">/ hr</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">This will be displayed on your mentor profile.</p>
                                </div>
                            </div>
                        </div>
                        {/* Services */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-teal-600" />
                                    <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Your Services</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setAddingService(true)}
                                    className="flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-teal-100 transition-all"
                                >
                                    <Plus className="h-3.5 w-3.5" /> Add Service
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* Add new service form */}
                                {addingService && (
                                    <form
                                        onSubmit={handleAddService}
                                        className="bg-teal-50/50 border border-teal-100 rounded-xl p-4 space-y-3"
                                    >
                                        <h3 className="text-xs font-extrabold text-teal-700 uppercase tracking-wider">New Service</h3>
                                        <input
                                            type="text"
                                            placeholder="Service Title (e.g. Statement of Purpose Review)"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                                            required
                                        />
                                        <textarea
                                            placeholder="Brief description of what this service includes..."
                                            value={newDesc}
                                            onChange={(e) => setNewDesc(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all resize-none h-16"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    value={newPrice}
                                                    onChange={(e) => setNewPrice(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                                                    required
                                                    min={1}
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Duration (e.g. 45 min)"
                                                value={newDuration}
                                                onChange={(e) => setNewDuration(e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => { setAddingService(false); setNewTitle(""); setNewDesc(""); setNewPrice(""); setNewDuration(""); }}
                                                className="flex-1 py-2 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-white bg-[#005F59] hover:bg-teal-800 transition-all"
                                            >
                                                <Plus className="h-4 w-4" /> Add
                                            </button>
                                        </div>
                                    </form>
                                )}
                                {/* Services list */}
                                <div className="space-y-3">
                                    {services.map((svc) => (
                                        <div
                                            key={svc.id}
                                            className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                                        >
                                            <div className="space-y-1 flex-1">
                                                <h4 className="text-sm font-bold text-slate-900">{svc.title}</h4>
                                                <p className="text-xs text-slate-500 leading-relaxed">{svc.description}</p>
                                                <div className="flex items-center gap-3 pt-1">
                                                    <span className="text-sm font-extrabold text-teal-700">{svc.currency}{svc.price}</span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> {svc.duration}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveService(svc.id)}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {services.length === 0 && !addingService && (
                                        <div className="text-center py-8 text-slate-400">
                                            <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                            <p className="text-sm font-semibold">No services added yet.</p>
                                            <p className="text-xs mt-1">Click "Add Service" above to get started.</p>
                                        </div>
                                    )}
                                </div>
                                {services.length > 0 && (
                                    <div className="flex items-center gap-2 bg-teal-50 rounded-xl px-4 py-3 border border-teal-100">
                                        <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
                                        <p className="text-xs text-teal-700 font-semibold">
                                            {services.length} service{services.length > 1 ? "s" : ""} configured. You can edit these anytime from your profile.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!step2Valid}
                                className="flex items-center gap-2 bg-[#005F59] hover:bg-teal-800 active:scale-[0.98] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md shadow-teal-900/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                            >
                                Finish & Go to Dashboard <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

