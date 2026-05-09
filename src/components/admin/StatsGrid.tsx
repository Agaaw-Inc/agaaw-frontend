/**
 * Stats Grid
 *
 * Displays the top-level summary cards on the admin dashboard.
 * Accepts stats data as props from the dashboard page,
 * which fetches from GET /api/admin/dashboard/stats.
 *
 * Shows a loading skeleton when data hasn't loaded yet.
 */

import SummaryCard from "./SummaryCard";
import type { DashboardStatsResponse } from "@/lib/adminTypes";

interface StatsGridProps {
  /** Stats data from the backend, or null while loading */
  stats: DashboardStatsResponse["overview"] | null;
  /** Whether the data is still being fetched */
  isLoading?: boolean;
}

/** Animated pulse placeholder for loading state */
function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
      <div className="h-3 w-24 bg-gray-200 rounded mb-4" />
      <div className="h-7 w-16 bg-gray-200 rounded" />
    </div>
  );
}

export default function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <SummaryCard title="Total Users" value={stats.totalUsers} />
      <SummaryCard title="Total Students" value={stats.totalStudents} />
      <SummaryCard title="Total Mentors" value={stats.totalMentors} />
      <SummaryCard title="Pending Mentors" value={stats.pendingMentors} />
      <SummaryCard title="Scholarships" value={stats.totalScholarships} />
    </div>
  );
}