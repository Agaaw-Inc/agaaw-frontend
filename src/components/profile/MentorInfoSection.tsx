"use client";

import { useState } from "react";
import {
  Edit3,
  Save,
  X,
  Briefcase,
  DollarSign,
  Globe2,
  Languages,
  Clock,
  ExternalLink,
  MapPin,
  GraduationCap,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// Country list for the select dropdown
const COUNTRY_OPTIONS = [
  "Bangladesh",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Netherlands",
  "Japan",
  "France",
  "Sweden",
  "South Korea",
  "India",
  "China",
  "Malaysia",
  "Other",
];

interface MentorInfoSectionProps {
  university: string;
  country: string;
  countryFlag: string;
  experience_years: number;
  hourly_rate: number;
  portfolio_link: string;
  languages: string[];
  is_available: boolean;
  bio: string;
  isOwner: boolean;
}

export default function MentorInfoSection({
  university,
  country,
  countryFlag,
  experience_years,
  hourly_rate,
  portfolio_link,
  languages,
  is_available,
  bio,
  isOwner,
}: MentorInfoSectionProps) {
  const [editing, setEditing] = useState(false);

  // Local state for editable fields
  const [localUniversity, setLocalUniversity] = useState(university);
  const [localCountry, setLocalCountry] = useState(country);
  const [localExperience, setLocalExperience] = useState(experience_years);
  const [localHourlyRate, setLocalHourlyRate] = useState(hourly_rate);
  const [localPortfolio, setLocalPortfolio] = useState(portfolio_link);
  const [localLanguages, setLocalLanguages] = useState(languages);
  const [localAvailable, setLocalAvailable] = useState(is_available);
  const [localBio, setLocalBio] = useState(bio);
  const [newLang, setNewLang] = useState("");

  const handleSave = () => {
    // In a real app, this would call an API
    setEditing(false);
  };

  const handleCancel = () => {
    setLocalUniversity(university);
    setLocalCountry(country);
    setLocalExperience(experience_years);
    setLocalHourlyRate(hourly_rate);
    setLocalPortfolio(portfolio_link);
    setLocalLanguages(languages);
    setLocalAvailable(is_available);
    setLocalBio(bio);
    setEditing(false);
  };

  const addLanguage = () => {
    if (newLang.trim() && !localLanguages.includes(newLang.trim())) {
      setLocalLanguages([...localLanguages, newLang.trim()]);
      setNewLang("");
    }
  };

  const removeLanguage = (lang: string) => {
    setLocalLanguages(localLanguages.filter((l) => l !== lang));
  };

  // ─── Read-only display for students / public view ────────────
  if (!isOwner) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          Mentor Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard
            icon={GraduationCap}
            label="University"
            value={localUniversity}
            gradient="from-teal-500 to-emerald-500"
          />
          <InfoCard
            icon={MapPin}
            label="Country"
            value={`${countryFlag} ${localCountry}`}
            gradient="from-blue-500 to-indigo-500"
          />
          <InfoCard
            icon={Briefcase}
            label="Experience"
            value={`${localExperience} years`}
            gradient="from-violet-500 to-purple-500"
          />
          <InfoCard
            icon={DollarSign}
            label="Hourly Rate"
            value={`$${localHourlyRate}/hr`}
            gradient="from-amber-500 to-orange-500"
          />
          <InfoCard
            icon={Languages}
            label="Languages"
            value={localLanguages.join(", ")}
            gradient="from-pink-500 to-rose-500"
          />
          <InfoCard
            icon={Clock}
            label="Availability"
            value={localAvailable ? "Available" : "Not Available"}
            gradient={localAvailable ? "from-emerald-500 to-green-500" : "from-gray-400 to-gray-500"}
          />
        </div>
        {localPortfolio && (
          <a
            href={localPortfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-teal-600 font-medium hover:text-teal-700 transition-colors"
          >
            <ExternalLink size={14} />
            View Portfolio
          </a>
        )}
      </div>
    );
  }

  // ─── Editable form for owner / mentor ────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Mentor Details
        </h2>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 text-xs text-gray-500 font-medium hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
              >
                <X size={13} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 text-xs text-white font-medium bg-teal-600 hover:bg-teal-700 transition-colors px-3 py-1.5 rounded-lg"
              >
                <Save size={13} />
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50"
            >
              <Edit3 size={13} />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* ─── Not Editing: card grid ─────────────────────────────── */}
      {!editing && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard
              icon={GraduationCap}
              label="University"
              value={localUniversity}
              gradient="from-teal-500 to-emerald-500"
            />
            <InfoCard
              icon={MapPin}
              label="Country"
              value={`${countryFlag} ${localCountry}`}
              gradient="from-blue-500 to-indigo-500"
            />
            <InfoCard
              icon={Briefcase}
              label="Experience"
              value={`${localExperience} years`}
              gradient="from-violet-500 to-purple-500"
            />
            <InfoCard
              icon={DollarSign}
              label="Hourly Rate"
              value={`$${localHourlyRate}/hr`}
              gradient="from-amber-500 to-orange-500"
            />
            <InfoCard
              icon={Languages}
              label="Languages"
              value={localLanguages.join(", ")}
              gradient="from-pink-500 to-rose-500"
            />
            <InfoCard
              icon={Clock}
              label="Availability"
              value={localAvailable ? "Available" : "Not Available"}
              gradient={localAvailable ? "from-emerald-500 to-green-500" : "from-gray-400 to-gray-500"}
            />
          </div>
          {localPortfolio && (
            <a
              href={localPortfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-teal-600 font-medium hover:text-teal-700 transition-colors"
            >
              <ExternalLink size={14} />
              View Portfolio
            </a>
          )}
        </>
      )}

      {/* ─── Editing: form fields ───────────────────────────────── */}
      {editing && (
        <div className="space-y-5">
          {/* University */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Current University
            </label>
            <input
              type="text"
              value={localUniversity}
              onChange={(e) => setLocalUniversity(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              placeholder="e.g. University of Oxford"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Country
            </label>
            <select
              value={localCountry}
              onChange={(e) => setLocalCountry(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white appearance-none cursor-pointer"
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Experience & Hourly Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Experience (years)
              </label>
              <input
                type="number"
                value={localExperience}
                onChange={(e) => setLocalExperience(Number(e.target.value))}
                min={0}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Hourly Rate (USD)
              </label>
              <div className="relative">
                <DollarSign
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  value={localHourlyRate}
                  onChange={(e) => setLocalHourlyRate(Number(e.target.value))}
                  min={0}
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Bio
            </label>
            <textarea
              value={localBio}
              onChange={(e) => setLocalBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
              placeholder="Tell students about yourself, your expertise, and what you can help with..."
            />
            <p className="text-[10px] text-gray-400 mt-1">
              {localBio.length}/500 characters
            </p>
          </div>

          {/* Portfolio Link */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Portfolio / Website Link
            </label>
            <div className="relative">
              <Globe2
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="url"
                value={localPortfolio}
                onChange={(e) => setLocalPortfolio(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Languages
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {localLanguages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-pink-50 text-pink-700 border border-pink-100 rounded-full text-xs font-medium"
                >
                  {lang}
                  <button
                    onClick={() => removeLanguage(lang)}
                    className="text-pink-400 hover:text-pink-700 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLang}
                onChange={(e) => setNewLang(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLanguage()}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                placeholder="Add a language..."
              />
              <button
                onClick={addLanguage}
                className="px-4 py-2 bg-pink-50 text-pink-700 rounded-xl text-xs font-semibold hover:bg-pink-100 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Availability
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {localAvailable
                  ? "You are visible and accepting new students"
                  : "You are hidden from student searches"}
              </p>
            </div>
            <button
              onClick={() => setLocalAvailable(!localAvailable)}
              className="flex items-center gap-2"
            >
              {localAvailable ? (
                <ToggleRight size={32} className="text-emerald-500" />
              ) : (
                <ToggleLeft size={32} className="text-gray-400" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Info Card helper ────────────────────────────────────────────

function InfoCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  gradient: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-gray-50 hover:border-gray-100 transition-all">
      <div
        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-2`}
      >
        <Icon size={16} className="text-white" />
      </div>
      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}
