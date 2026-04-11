"use client";

import { useState } from "react";
import { GraduationCap, Award, Edit3, Save, X, Plus, Trash2 } from "lucide-react";
import type { Education, TestScore } from "@/data/profileTypes";

interface AcademicSectionProps {
  education: Education[];
  testScores: TestScore[];
  isOwner: boolean;
}

export default function AcademicSection({
  education,
  testScores,
  isOwner,
}: AcademicSectionProps) {
  const [editing, setEditing] = useState(false);
  const [localEducation, setLocalEducation] = useState(education);
  const [localScores, setLocalScores] = useState(testScores);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Academic Background</h2>
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

      {/* Education */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <GraduationCap size={14} />
          Education
        </h3>
        <div className="space-y-3">
          {localEducation.map((edu, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl border border-gray-50 hover:border-gray-100 transition-all"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shrink-0">
                <GraduationCap size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {edu.degree} in {edu.field}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {edu.institution} · {edu.year}
                </p>
              </div>
              {editing && (
                <button
                  onClick={() =>
                    setLocalEducation(localEducation.filter((_, idx) => idx !== i))
                  }
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <button
            onClick={() =>
              setLocalEducation([
                ...localEducation,
                { degree: "", field: "", institution: "", year: "" },
              ])
            }
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 border-2 border-dashed border-blue-200 text-blue-600 rounded-xl text-xs font-medium hover:bg-blue-50 transition-colors"
          >
            <Plus size={14} />
            Add Education
          </button>
        )}
      </div>

      {/* Test Scores */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Award size={14} />
          Test Scores
        </h3>
        <div className="flex flex-wrap gap-3">
          {localScores.map((score, i) => (
            <div
              key={i}
              className="relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl"
            >
              <span className="text-xs font-medium text-gray-500">
                {score.name}
              </span>
              <span className="text-sm font-bold text-gray-900">
                {score.score}
              </span>
              {editing && (
                <button
                  onClick={() =>
                    setLocalScores(localScores.filter((_, idx) => idx !== i))
                  }
                  className="ml-1 p-0.5 text-red-400 hover:text-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
