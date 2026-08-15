"use client";

import Link from "next/link";
import { User, Share2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";

interface BlogActionButtonsProps {
  authorId: string;
  authorRole: string;
  blogTitle: string;
}

export default function BlogActionButtons({ authorId, authorRole, blogTitle }: BlogActionButtonsProps) {
  const { toast, showToast, hideToast } = useToast();

  const handleShare = async () => {
    const url = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: blogTitle,
          text: `Check out this insight: ${blogTitle}`,
          url: url,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log("Share failed or cancelled:", err);
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        showToast("Link copied to clipboard!");
      } catch (err) {
        console.error("Clipboard copy failed:", err);
        showToast("Failed to copy link", "error");
      }
    } else {
      showToast("Sharing is not supported on this browser", "error");
    }
  };

  const isMentor = authorRole === "mentor";

  return (
    <>
      <div className="space-y-4">
        {isMentor ? (
          <Link
            href={`/profile/mentor/${authorId}`}
            className="w-full py-3 px-4 bg-white hover:bg-slate-900 hover:text-white rounded-2xl text-slate-600 font-bold text-xs transition-all border border-slate-200 flex items-center justify-center gap-2 group text-center block"
          >
            <User size={14} className="group-hover:scale-110 transition-transform" /> VIEW PROFILE
          </Link>
        ) : (
          <button
            disabled
            className="w-full py-3 px-4 bg-slate-100 text-slate-400 rounded-2xl font-bold text-xs border border-slate-200 flex items-center justify-center gap-2 cursor-not-allowed"
            title="Only mentors have public profiles"
          >
            <User size={14} /> VIEW PROFILE
          </button>
        )}
        <button
          onClick={handleShare}
          className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-xs transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Share2 size={14} className="group-hover:rotate-12 transition-transform" /> SHARE INSIGHT
        </button>
      </div>
      <Toast toast={toast} onHide={hideToast} />
    </>
  );
}
