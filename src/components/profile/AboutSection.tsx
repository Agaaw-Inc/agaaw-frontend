"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Edit3, Save, X } from "lucide-react";

interface AboutSectionProps {
  bio: string;
  isOwner: boolean;
}

export default function AboutSection({ bio, isOwner }: AboutSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState(bio);

  const shouldTruncate = bio.length > 300;
  const displayBio = expanded || !shouldTruncate ? bio : bio.slice(0, 300) + "...";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">About</h2>
        {isOwner && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50"
          >
            <Edit3 size={13} />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <textarea
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm text-gray-700 resize-none"
            placeholder="Tell people about yourself..."
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setEditBio(bio);
                setEditing(false);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-white font-semibold bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Save size={14} />
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {displayBio}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-3 text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors"
            >
              {expanded ? (
                <>
                  Show less <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Read more <ChevronDown size={14} />
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}
