"use client";

import { useState } from "react";
import { Plus, X, Edit3, Save } from "lucide-react";

interface ExpertiseSectionProps {
  expertise: string[];
  isOwner: boolean;
}

export default function ExpertiseSection({ expertise, isOwner }: ExpertiseSectionProps) {
  const [editing, setEditing] = useState(false);
  const [tags, setTags] = useState(expertise);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Color palette for tags
  const tagColors = [
    "bg-teal-50 text-teal-700 border-teal-100",
    "bg-violet-50 text-violet-700 border-violet-100",
    "bg-blue-50 text-blue-700 border-blue-100",
    "bg-amber-50 text-amber-700 border-amber-100",
    "bg-rose-50 text-rose-700 border-rose-100",
    "bg-emerald-50 text-emerald-700 border-emerald-100",
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Expertise</h2>
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

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              tagColors[i % tagColors.length]
            }`}
          >
            {tag}
            {editing && (
              <button
                onClick={() => removeTag(tag)}
                className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </span>
        ))}
      </div>

      {editing && (
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="Add expertise..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
          <button
            onClick={addTag}
            className="flex items-center gap-1 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      )}
    </div>
  );
}
