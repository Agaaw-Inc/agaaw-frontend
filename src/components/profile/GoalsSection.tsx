"use client";

import { useState } from "react";
import {
  Target,
  Globe,
  GraduationCap,
  Calendar,
  Edit3,
  Save,
  Bookmark,
} from "lucide-react";

interface GoalsSectionProps {
  goals: {
    targetCountries: string[];
    targetDegree: string;
    scholarshipInterests: string[];
    timeline: string;
  };
  interests: string[];
  isOwner: boolean;
}

export default function GoalsSection({ goals, interests, isOwner }: GoalsSectionProps) {
  const [editing, setEditing] = useState(false);

  const goalItems = [
    {
      icon: Globe,
      label: "Target Countries",
      value: goals.targetCountries.join(", "),
      color: "from-teal-500 to-emerald-500",
    },
    {
      icon: GraduationCap,
      label: "Target Degree",
      value: goals.targetDegree,
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Calendar,
      label: "Timeline",
      value: goals.timeline,
      color: "from-blue-500 to-indigo-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Goals & Interests</h2>
        {isOwner && (
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-1.5 text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50"
          >
            {editing ? <Save size={13} /> : <Edit3 size={13} />}
            {editing ? "Done" : "Edit"}
          </button>
        )}
      </div>

      {/* Goal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {goalItems.map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-xl border border-gray-50 hover:border-gray-100 transition-all"
          >
            <div
              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-2`}
            >
              <item.icon size={16} className="text-white" />
            </div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
              {item.label}
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Scholarship interests */}
      <div className="mb-5">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Bookmark size={14} />
          Scholarship Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {goals.scholarshipInterests.map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-medium"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Research interests */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Target size={14} />
          Research Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {interests.map((i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-violet-50 text-violet-700 border border-violet-100 rounded-full text-xs font-medium"
            >
              {i}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
