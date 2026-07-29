"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Loader2, Megaphone } from "lucide-react";
import Footer from "@/components/landing/Footer";
import {
  getAnnouncementDetail,
  isSafeExternalLink,
  isSafeInternalLink,
  type AnnouncementDetail,
} from "@/services/notificationService";

const AUDIENCE_LABELS: Record<AnnouncementDetail["audience"], string> = {
  all: "All users",
  students: "Students",
  mentors: "Mentors",
};

/**
 * Dedicated page an `announcement` notification always opens to (Step B —
 * follow-up). An announcement can be about anything, so unlike session/
 * request/scholarship notifications it never redirects into a feature page —
 * it always lands here with the full title/message/sender/date. Any optional
 * admin-supplied link is offered as a CTA, not the destination itself.
 */
export default function AnnouncementDetailPage({
  dashboardRole,
  announcementId,
}: {
  dashboardRole: "student" | "mentor";
  announcementId: string;
}) {
  const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);
    getAnnouncementDetail(announcementId)
      .then((result) => {
        if (!cancelled) setAnnouncement(result);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [announcementId]);

  const notificationsHref = `/dashboard/${dashboardRole}/notifications`;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Link
          href={notificationsHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft size={16} /> Back to notifications
        </Link>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-teal-600 mb-2" />
            <p className="text-sm font-semibold text-gray-500">Loading announcement...</p>
          </div>
        ) : notFound || !announcement ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
            <Megaphone className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-700 mb-1">Announcement not found</h2>
            <p className="text-sm text-gray-400">
              It may have been removed, or it isn&apos;t addressed to your account.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex items-start gap-4">
              <span className="w-11 h-11 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <Megaphone size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold text-gray-900 leading-snug">
                  {announcement.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-xs text-gray-500">
                  <span>From {announcement.sentBy}</span>
                  <span>&middot;</span>
                  <span>
                    {new Date(announcement.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>&middot;</span>
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold">
                    {AUDIENCE_LABELS[announcement.audience]}
                  </span>
                </div>
              </div>
            </div>

            {/* Plain text only — never render as HTML/markdown (Step B8) */}
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {announcement.message}
            </p>

            {isSafeInternalLink(announcement.link) && (
              <Link
                href={announcement.link}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition-colors"
              >
                Open link
              </Link>
            )}
            {isSafeExternalLink(announcement.link) && (
              <a
                href={announcement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition-colors"
              >
                Open link <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
