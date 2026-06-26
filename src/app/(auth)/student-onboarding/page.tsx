"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  MapPin, 
  Award, 
  Bookmark, 
  Calendar, 
  ChevronDown, 
  Upload, 
  Plus, 
  Search, 
  Globe, 
  Phone, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Bell, 
  FileText, 
  Link2, 
  Info,
  X
} from "lucide-react";

export default function StudentOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // --- Step 1 State: Study Goals ---
  const [targetCountries, setTargetCountries] = useState<string[]>(["USA", "Canada", "UK"]);
  const [countryInput, setCountryInput] = useState("");
  const [targetSubject, setTargetSubject] = useState<string[]>(["Data Science", "Machine Learning"]);
  const [subjectInput, setSubjectInput] = useState("");
  const [degreeLevel, setDegreeLevel] = useState<"Bachelor's" | "Master's" | "PhD" | "">("Bachelor's");
  const [preferredIntake, setPreferredIntake] = useState("Fall (September)");

  const allCountries = ["USA", "Canada", "UK", "Germany", "Australia", "Japan", "Sweden", "Netherlands", "Bangladesh", "India", "Malaysia"];
  const allSubjects = ["Computer Science", "Artificial Intelligence", "Data Science", "Machine Learning", "Software Engineering", "Information Technology", "Business Administration", "Economics", "Mechanical Engineering", "Electrical Engineering", "Physics", "Chemistry"];

  // --- Step 2 State: Academic Background ---
  const [educationLevel, setEducationLevel] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [gpaScale, setGpaScale] = useState<"4.0" | "5.0" | "100%">("4.0");
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);

  // --- Step 3 State: Additional Information ---
  const [currentCountry, setCurrentCountry] = useState("");
  const [phoneCode, setPhoneCode] = useState("+880");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");

  // --- Step 4 State: CV Upload & About yourself ---
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Load from LocalStorage if exists
  useEffect(() => {
    const saved = localStorage.getItem("student_onboarding_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.step) setStep(parsed.step);
        if (parsed.targetCountries) setTargetCountries(parsed.targetCountries);
        if (parsed.targetSubject) setTargetSubject(parsed.targetSubject);
        if (parsed.degreeLevel) setDegreeLevel(parsed.degreeLevel);
        if (parsed.preferredIntake) setPreferredIntake(parsed.preferredIntake);
        if (parsed.educationLevel) setEducationLevel(parsed.educationLevel);
        if (parsed.graduationYear) setGraduationYear(parsed.graduationYear);
        if (parsed.institutionName) setInstitutionName(parsed.institutionName);
        if (parsed.cgpa) setCgpa(parsed.cgpa);
        if (parsed.gpaScale) setGpaScale(parsed.gpaScale);
        if (parsed.currentCountry) setCurrentCountry(parsed.currentCountry);
        if (parsed.phoneCode) setPhoneCode(parsed.phoneCode);
        if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
        if (parsed.dob) setDob(parsed.dob);
      } catch (e) {
        console.error("Failed to parse onboarding data", e);
      }
    }
  }, []);

  // Save progress
  const saveProgress = (nextStep: number) => {
    const data = {
      step: nextStep,
      targetCountries,
      targetSubject,
      degreeLevel,
      preferredIntake,
      educationLevel,
      graduationYear,
      institutionName,
      cgpa,
      gpaScale,
      currentCountry,
      phoneCode,
      phoneNumber,
      dob,
    };
    localStorage.setItem("student_onboarding_data", JSON.stringify(data));
    setStep(nextStep);
  };

  const handleNextStep = () => {
    if (step < 4) {
      saveProgress(step + 1);
    } else {
      // Completed! Mark completed and redirect to dashboard
      localStorage.setItem("student_onboarding_completed", "true");
      router.push("/dashboard/student");
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      saveProgress(step - 1);
    } else {
      router.push("/my-profile"); // Or profile page
    }
  };

  const handleSkip = () => {
    if (step === 4) {
      localStorage.setItem("student_onboarding_completed", "true");
      router.push("/dashboard/student");
    } else {
      saveProgress(step + 1);
    }
  };

  // Autocomplete Helpers
  const addCountry = (country: string) => {
    if (country && !targetCountries.includes(country)) {
      setTargetCountries([...targetCountries, country]);
    }
    setCountryInput("");
  };

  const removeCountry = (country: string) => {
    setTargetCountries(targetCountries.filter(c => c !== country));
  };

  const addSubject = (subj: string) => {
    if (subj && !targetSubject.includes(subj)) {
      setTargetSubject([...targetSubject, subj]);
    }
    setSubjectInput("");
  };

  const removeSubject = (subj: string) => {
    setTargetSubject(targetSubject.filter(s => s !== subj));
  };

  // Mock File Uploads
  const handleTranscriptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTranscriptFile(e.target.files[0]);
    }
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* ------------------------------------------------------------- */}
      {/* Header bar (For Steps 2, 3, 4) */}
      {/* ------------------------------------------------------------- */}
      {step > 1 && (
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#005F59] text-white p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">Agaaw</span>
          </div>

          <div className="flex items-center gap-4">
            {step === 3 && (
              <span className="text-[11px] font-bold text-slate-550 tracking-wider uppercase">
                Academic Identity Verification
              </span>
            )}
            {step !== 3 && (
              <span className="text-sm font-semibold text-slate-600">
                Step {step} of 4
              </span>
            )}
            
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>

            <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-100 overflow-hidden">
              <img 
                src="https://i.pravatar.cc/100?img=12" 
                alt="User Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 1: Study Goals (Split Screen View) */}
      {/* ------------------------------------------------------------- */}
      {step === 1 && (
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Left panel */}
          <div className="w-full md:w-[35%] bg-[#005F59] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Visual element / background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="inline-block bg-teal-850/40 text-teal-200 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Onboarding
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Your Future Starts Here
              </h1>
              <p className="text-teal-100 text-sm">
                Step 1 of 4: Defining your path
              </p>

              {/* Study Hall Mockup Image */}
              <div className="rounded-2xl overflow-hidden border border-teal-500/30 shadow-2xl relative aspect-video bg-teal-950 mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop" 
                  alt="Study Hall" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-semibold text-teal-300">Agaaw Educational Portal</p>
                  <p className="text-sm font-bold text-white">Global University Matchmaking</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-3 mt-12 md:mt-0 pt-8 border-t border-teal-500/20">
              <h3 className="font-bold text-base text-white">Academic Rigor</h3>
              <p className="text-xs leading-relaxed text-teal-100">
                We use your study goals to filter the most prestigious institutions that align with your career trajectory. Precision in your selection ensures a higher acceptance rate.
              </p>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 bg-white p-8 md:p-12 flex flex-col justify-between max-w-4xl mx-auto w-full">
            <div className="space-y-8">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Onboarding Progress</span>
                  <span className="text-[#005F59]">25% Complete</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-[#005F59] rounded-full transition-all duration-500"></div>
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-1.5">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Study Goals</h2>
                <p className="text-sm text-slate-500">
                  Tell us where and what you want to study so we can tailor your experience.
                </p>
              </div>

              {/* Form fields */}
              <div className="space-y-6">
                {/* Target Country */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Target Country
                  </label>
                  <div className="border border-slate-200 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 rounded-xl p-3 bg-slate-50/50 flex flex-wrap gap-2 items-center min-h-[50px] transition-all">
                    {targetCountries.map(country => (
                      <span key={country} className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors border border-slate-150">
                        {country}
                        <button type="button" onClick={() => removeCountry(country)} className="text-slate-400 hover:text-slate-600 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <div className="relative flex-1 min-w-[120px]">
                      <input 
                        type="text" 
                        placeholder="Add country..." 
                        value={countryInput}
                        onChange={(e) => setCountryInput(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-sm p-0.5 placeholder:text-slate-400 focus:ring-0"
                      />
                      {countryInput && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-150 rounded-xl shadow-lg max-h-40 overflow-y-auto z-50 py-1">
                          {allCountries
                            .filter(c => c.toLowerCase().includes(countryInput.toLowerCase()) && !targetCountries.includes(c))
                            .map(c => (
                              <button key={c} type="button" onClick={() => addCountry(c)} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold transition-colors">
                                {c}
                              </button>
                            ))
                          }
                          {allCountries.filter(c => c.toLowerCase().includes(countryInput.toLowerCase()) && !targetCountries.includes(c)).length === 0 && (
                            <button type="button" onClick={() => addCountry(countryInput)} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-teal-600 transition-colors">
                              Add "{countryInput}"
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Target Subject / Major */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Target Subject / Major
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Search className="h-4.5 w-4.5" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search majors (e.g., Computer Science, Economics)" 
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-400"
                    />
                    {subjectInput && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-150 rounded-xl shadow-lg max-h-40 overflow-y-auto z-50 py-1">
                        {allSubjects
                          .filter(s => s.toLowerCase().includes(subjectInput.toLowerCase()) && !targetSubject.includes(s))
                          .map(s => (
                            <button key={s} type="button" onClick={() => addSubject(s)} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold transition-colors">
                              {s}
                            </button>
                          ))
                        }
                        {allSubjects.filter(s => s.toLowerCase().includes(subjectInput.toLowerCase()) && !targetSubject.includes(s)).length === 0 && (
                          <button type="button" onClick={() => addSubject(subjectInput)} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-teal-600 transition-colors">
                            Add "{subjectInput}"
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Selected and quick-choice tags */}
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {targetSubject.map(subj => (
                      <span key={subj} className="flex items-center gap-1 bg-teal-50 text-[#005F59] text-xs font-semibold py-1.5 px-3 rounded-lg border border-teal-100">
                        {subj}
                        <button type="button" onClick={() => removeSubject(subj)} className="text-teal-600 hover:text-teal-800 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {!targetSubject.includes("Data Science") && (
                      <button 
                        type="button" 
                        onClick={() => addSubject("Data Science")}
                        className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-semibold py-1.5 px-3.5 rounded-lg transition-colors"
                      >
                        Data Science
                      </button>
                    )}
                    {!targetSubject.includes("Machine Learning") && (
                      <button 
                        type="button" 
                        onClick={() => addSubject("Machine Learning")}
                        className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-semibold py-1.5 px-3.5 rounded-lg transition-colors"
                      >
                        Machine Learning
                      </button>
                    )}
                  </div>
                </div>

                {/* Degree Level */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                    Degree Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button 
                      type="button"
                      onClick={() => setDegreeLevel("Bachelor's")}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center space-y-2 py-6 ${
                        degreeLevel === "Bachelor's" 
                          ? "border-[#005F59] bg-teal-50/50 text-[#005F59] font-bold shadow-sm" 
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-350 hover:bg-slate-50/30"
                      }`}
                    >
                      <Award className={`h-6 w-6 ${degreeLevel === "Bachelor's" ? "text-[#005F59]" : "text-slate-400"}`} />
                      <span className="text-xs font-semibold">Bachelor's</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDegreeLevel("Master's")}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center space-y-2 py-6 ${
                        degreeLevel === "Master's" 
                          ? "border-[#005F59] bg-teal-50/50 text-[#005F59] font-bold shadow-sm" 
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-350 hover:bg-slate-50/30"
                      }`}
                    >
                      <GraduationCap className={`h-6 w-6 ${degreeLevel === "Master's" ? "text-[#005F59]" : "text-slate-400"}`} />
                      <span className="text-xs font-semibold">Master's</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDegreeLevel("PhD")}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center space-y-2 py-6 ${
                        degreeLevel === "PhD" 
                          ? "border-[#005F59] bg-teal-50/50 text-[#005F59] font-bold shadow-sm" 
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-350 hover:bg-slate-50/30"
                      }`}
                    >
                      <Bookmark className={`h-6 w-6 ${degreeLevel === "PhD" ? "text-[#005F59]" : "text-slate-400"}`} />
                      <span className="text-xs font-semibold">PhD</span>
                    </button>
                  </div>
                </div>

                {/* Preferred Intake */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                    Preferred Intake
                  </label>
                  <div className="relative">
                    <select 
                      value={preferredIntake} 
                      onChange={(e) => setPreferredIntake(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm appearance-none focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-semibold"
                    >
                      <option value="Fall (September)">Fall (September)</option>
                      <option value="Spring (January)">Spring (January)</option>
                      <option value="Summer (May)">Summer (May)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ChevronDown className="h-4.5 w-4.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-10 border-t border-slate-100 mt-12">
              <button 
                type="button" 
                onClick={handleBackStep}
                className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Profile
              </button>
              
              <button 
                type="button"
                onClick={handleNextStep}
                disabled={targetCountries.length === 0 || !degreeLevel}
                className="flex items-center gap-2 bg-[#005F59] hover:bg-teal-850 active:scale-[0.98] text-white px-6 py-3 rounded-lg text-sm font-bold shadow-md shadow-teal-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 2: Academic Background */}
      {/* ------------------------------------------------------------- */}
      {step === 2 && (
        <main className="flex-1 max-w-3xl mx-auto px-6 py-8 w-full flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header section with progress */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Background</h1>
                <p className="text-sm text-slate-500">
                  Tell us about your educational journey to match with the best opportunities.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">
                  50% COMPLETE
                </span>
                <div className="h-2 w-28 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-[#005F59] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Step form card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50 flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-teal-600" />
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Education Details
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Education Level */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                      Current Education Level
                    </label>
                    <div className="relative">
                      <select 
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-250 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-semibold"
                      >
                        <option value="">Select level</option>
                        <option value="High School">High School</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="PhD / Doctorate">PhD / Doctorate</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Graduation Year */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                      Graduation Year
                    </label>
                    <div className="relative">
                      <select 
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-250 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-semibold"
                      >
                        <option value="">Expected Year</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                        <option value="2030">2030</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Calendar className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Institution Name */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                    Institution / University Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <GraduationCap className="h-4.5 w-4.5" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. University of Oxford"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-250 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-semibold placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* CGPA / GPA and GPA Scale */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                      CGPA / GPA
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Award className="h-4.5 w-4.5" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="e.g. 3.85"
                        value={cgpa}
                        onChange={(e) => setCgpa(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-250 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-semibold placeholder:text-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                      GPA Scale
                    </label>
                    <div className="flex border border-slate-200 rounded-xl p-1 bg-slate-50/50 h-[46px] items-center">
                      <button 
                        type="button" 
                        onClick={() => setGpaScale("4.0")}
                        className={`flex-1 text-xs font-extrabold py-2 px-3 rounded-lg transition-all ${
                          gpaScale === "4.0" 
                            ? "bg-white text-slate-900 shadow-sm border border-slate-100" 
                            : "text-slate-450 hover:text-slate-700"
                        }`}
                      >
                        4.0
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setGpaScale("5.0")}
                        className={`flex-1 text-xs font-extrabold py-2 px-3 rounded-lg transition-all ${
                          gpaScale === "5.0" 
                            ? "bg-white text-slate-900 shadow-sm border border-slate-100" 
                            : "text-slate-450 hover:text-slate-700"
                        }`}
                      >
                        5.0
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setGpaScale("100%")}
                        className={`flex-1 text-xs font-extrabold py-2 px-3 rounded-lg transition-all ${
                          gpaScale === "100%" 
                            ? "bg-white text-slate-900 shadow-sm border border-slate-100" 
                            : "text-slate-450 hover:text-slate-700"
                        }`}
                      >
                        100%
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info message */}
                <div className="bg-slate-50 rounded-xl border border-slate-150 p-4 flex gap-3 text-xs text-slate-600 leading-relaxed mt-4">
                  <Info className="h-5.5 w-5.5 text-teal-600 shrink-0 mt-0.5" />
                  <p>
                    Providing academic data helps us calculate your eligibility for institutional scholarships and research grants automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Transcripts upload card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-bold text-slate-900">Transcripts (Optional)</h3>
                <p className="text-xs text-slate-500">
                  Upload your latest academic transcript to get a 'Verified' badge early.
                </p>
              </div>

              <div className="relative shrink-0 w-full sm:w-auto">
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={handleTranscriptUpload}
                  className="hidden" 
                  id="transcript-upload-input"
                />
                <label 
                  htmlFor="transcript-upload-input"
                  className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-xl px-6 py-3 cursor-pointer text-xs font-bold text-slate-600 hover:text-teal-600 bg-white transition-all w-full text-center"
                >
                  <Upload className="h-4 w-4" /> 
                  {transcriptFile ? transcriptFile.name : "Upload PDF"}
                </label>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-10 border-t border-slate-100 mt-12">
            <button 
              type="button" 
              onClick={handleBackStep}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <button 
              type="button" 
              onClick={handleSkip}
              className="text-sm font-bold text-slate-450 hover:text-slate-650 transition-colors"
            >
              Skip for now
            </button>

            <button 
              type="button"
              onClick={handleNextStep}
              disabled={!educationLevel || !graduationYear || !institutionName || !cgpa}
              className="flex items-center gap-2 bg-[#005F59] hover:bg-teal-850 active:scale-[0.98] text-white px-6 py-3 rounded-lg text-sm font-bold shadow-md shadow-teal-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              Save & Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 3: Additional Information */}
      {/* ------------------------------------------------------------- */}
      {step === 3 && (
        <main className="flex-1 max-w-2xl mx-auto px-6 py-8 w-full flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header progress */}
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-[#005F59] uppercase tracking-wider">
                  Step 3 of 4
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Additional Information
                </h1>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-slate-800">75%</span>
              </div>
            </div>
            
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-[#005F59] rounded-full"></div>
            </div>

            {/* Form Box */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <p className="text-xs leading-relaxed text-slate-500">
                To finalize your academic profile, please provide these remaining details. This information helps us verify your eligibility for specific programs and regional opportunities.
              </p>

              <div className="space-y-4">
                {/* Your Country */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                    Your Country
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Globe className="h-4.5 w-4.5" />
                    </div>
                    <select 
                      value={currentCountry}
                      onChange={(e) => setCurrentCountry(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm appearance-none focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-semibold"
                    >
                      <option value="">Select your country</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="India">India</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                      <option value="Australia">Australia</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-32 shrink-0">
                      <select 
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm appearance-none focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-semibold text-center"
                      >
                        <option value="+880">+880 (BD)</option>
                        <option value="+91">+91 (IN)</option>
                        <option value="+1">+1 (US/CA)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+49">+49 (DE)</option>
                        <option value="+61">+61 (AU)</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="relative flex-1">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone className="h-4.5 w-4.5" />
                      </div>
                      <input 
                        type="tel" 
                        placeholder="1712-345678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-semibold placeholder:text-slate-400 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-semibold placeholder:text-slate-455 transition-all"
                    />
                  </div>
                </div>

                {/* Secure info card */}
                <div className="bg-slate-50 rounded-xl border border-slate-150 p-4 flex gap-3 text-xs text-slate-600 leading-relaxed mt-2">
                  <Info className="h-5.5 w-5.5 text-teal-600 shrink-0 mt-0.5" />
                  <p>
                    Your information is securely encrypted and will only be used for institutional verification purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Centered side-by-side action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-10 border-t border-slate-100 mt-12 w-full">
            <button 
              type="button"
              onClick={handleNextStep}
              disabled={!currentCountry || !phoneNumber || !dob}
              className="w-full sm:w-48 order-1 sm:order-2 flex items-center justify-center gap-2 bg-[#005F59] hover:bg-teal-850 active:scale-[0.98] text-white px-6 py-3.5 rounded-lg text-sm font-bold shadow-md shadow-teal-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              type="button" 
              onClick={handleBackStep}
              className="w-full sm:w-48 order-2 sm:order-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 px-6 py-3.5 rounded-lg text-sm font-bold transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>
        </main>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 4: CV Upload / How would you like to tell us about yourself? */}
      {/* ------------------------------------------------------------- */}
      {step === 4 && (
        <main className="flex-1 max-w-4xl mx-auto px-6 py-8 w-full flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header progress */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-[#005F59] uppercase tracking-wider">
                  Step 4 of 4
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Almost there!
                </h1>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-slate-550 uppercase tracking-wider">
                  100% Complete
                </span>
                <div className="h-2 w-28 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-[#005F59] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Main title */}
            <div className="text-center py-4 space-y-2">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                How would you like to tell us about yourself?
              </h2>
              <p className="text-sm text-slate-500 max-w-lg mx-auto">
                Complete your profile to start receiving academic recommendations tailored to your goals.
              </p>
            </div>

            {/* Main Upload Box & Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left CV Upload Box */}
              <div className="md:col-span-2 bg-white border border-slate-105 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-full text-teal-600">
                  <FileText className="h-10 w-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-900">Upload your CV</h3>
                  <p className="text-xs text-slate-500">
                    Drag and drop your PDF or DOCX file here
                  </p>
                </div>

                <div className="relative pt-2">
                  <input 
                    type="file" 
                    accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleCvUpload}
                    className="hidden" 
                    id="cv-upload-input"
                  />
                  <label 
                    htmlFor="cv-upload-input"
                    className="flex items-center gap-2 bg-[#005F59] hover:bg-teal-850 active:scale-[0.98] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
                  >
                    Select File <Plus className="h-4 w-4" />
                  </label>
                </div>

                <p className="text-[10px] font-bold text-slate-400">
                  {cvFile ? `Selected: ${cvFile.name} (${(cvFile.size / (1024 * 1024)).toFixed(2)}MB)` : "Maximum file size: 10MB"}
                </p>
              </div>

              {/* Right Manual & LinkedIn Stack */}
              <div className="flex flex-col gap-4">
                {/* Enter Manually Card */}
                <button 
                  type="button" 
                  onClick={handleNextStep}
                  className="bg-white border border-slate-105 hover:border-teal-500 rounded-2xl p-6 shadow-sm flex items-start gap-4 text-left transition-all hover:shadow-md"
                >
                  <div className="bg-slate-50 p-3 rounded-xl text-slate-550 border border-slate-100 shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-900">Enter Manually</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Fill in your details step by step.
                    </p>
                  </div>
                </button>

                {/* LinkedIn Import Card */}
                <button 
                  type="button"
                  onClick={handleNextStep}
                  className="bg-white border border-slate-105 hover:border-[#0077b5] rounded-2xl p-6 shadow-sm flex items-start gap-4 text-left transition-all hover:shadow-md"
                >
                  <div className="bg-slate-50 p-3 rounded-xl text-[#0077b5] border border-slate-100 shrink-0">
                    <Link2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-900">LinkedIn Import</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Sync your professional profile instantly.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Testimonial Quote Block */}
            <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 mt-8">
              <div className="h-14 w-14 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" 
                  alt="Student testimonial" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1 text-center md:text-left flex-1">
                <p className="text-xs italic text-slate-650 leading-relaxed">
                  "The profile setup was seamless. I uploaded my CV and within seconds Agaaw suggested three scholarship programs that perfectly matched my research background."
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  — Md. Omar Faruk Maruf, Graduate Student
                </p>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-10 border-t border-slate-100 mt-12">
            <button 
              type="button" 
              onClick={handleBackStep}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <button 
              type="button" 
              onClick={handleSkip}
              className="text-sm font-bold text-slate-450 hover:text-slate-650 transition-colors"
            >
              Skip for now
            </button>

            <button 
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-2 bg-[#005F59] hover:bg-teal-850 active:scale-[0.98] text-white px-6 py-3 rounded-lg text-sm font-bold shadow-md shadow-teal-900/10 transition-all"
            >
              Complete <Check className="h-4 w-4" />
            </button>
          </div>
        </main>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Sticky footer info */}
      {/* ------------------------------------------------------------- */}
      <footer className="py-6 text-center text-[10px] text-slate-400 bg-white border-t border-slate-100 mt-auto shrink-0 relative z-10">
        © 2026 Agaaw Educational Portal. All academic rights reserved.
      </footer>
    </div>
  );
}
