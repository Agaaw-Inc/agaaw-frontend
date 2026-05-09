"use client";

/**
 * Activity Feed
 *
 * Displays the most recent admin actions on the dashboard.
 * Accepts activity data as props from the dashboard page,
 * which fetches from GET /api/admin/dashboard/stats → recentActivity.
 *
 * Each entry shows the admin's name, action performed,
 * module affected, and a relative timestamp.
 */

import { Clock } from "lucide-react";
import type { ActivityLog } from "@/lib/adminTypes";

interface ActivityFeedProps {
  /** Activity log entries from the backend, or empty array while loading */
  activities: ActivityLog[];
  /** Whether the data is still being fetched */
  isLoading?: boolean;
}

/** Format an action string into a human-readable label */
function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Format a module name into a human-readable label */
function formatModule(module: string): string {
  return module
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Get relative time string from an ISO date */
function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

/** Loading skeleton for the feed */
function SkeletonRow() {
  return (
    <li className="flex justify-between items-center py-2.5 animate-pulse">
      <div className="flex-1">
        <div className="h-3 w-48 bg-gray-200 rounded mb-1.5" />
        <div className="h-2.5 w-32 bg-gray-100 rounded" />
      </div>
      <div className="h-3 w-16 bg-gray-100 rounded" />
    </li>
  );
}

export default function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-gray-400" />
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
      </div>

      <ul className="divide-y divide-gray-50">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : activities.length === 0 ? (
          <li className="py-8 text-center text-sm text-gray-400">
            No recent activity
          </li>
        ) : (
          activities.map((activity) => {
            const adminName = [
              activity.admin?.user?.firstName,
              activity.admin?.user?.lastName,
            ]
              .filter(Boolean)
              .join(" ") || "Unknown";

            return (
              <li
                key={activity.id}
                className="flex justify-between items-start py-2.5 gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{adminName}</span>
                    {" "}
                    <span className="text-gray-500">
                      {formatAction(activity.action)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatModule(activity.module)}
                    {activity.targetId && (
                      <span className="text-gray-300"> · {activity.targetId.slice(0, 8)}…</span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                  {timeAgo(activity.createdAt)}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}