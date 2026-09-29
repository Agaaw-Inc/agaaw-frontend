/**
 * Stats Grid
 *
 * Platform-wide counts (users, mentors, content) from
 * GET /api/admin/dashboard/stats. These are all-time totals — the dashboard's
 * range filter doesn't apply to them.
 */

import { BookOpen, GraduationCap, Hourglass, UserCheck, Users, UserRound } from "lucide-react";
import StatTile from "./analytics/StatTile";
import { count } from "./analytics/chartTheme";
import type { DashboardStatsResponse } from "@/lib/adminTypes";

interface StatsGridProps {
  /** Stats data from the backend, or null while loading */
  stats: DashboardStatsResponse["overview"] | null;
  /** Whether the data is still being fetched */
  isLoading?: boolean;
}

export default function StatsGrid({ stats, isLoading }: StatsGridProps) {
  const loading = isLoading || !stats;
  const tiles = [
    { label: "Total users", value: stats?.totalUsers, icon: Users },
    { label: "Students", value: stats?.totalStudents, icon: UserRound },
    { label: "Mentors", value: stats?.totalMentors, icon: UserCheck },
    { label: "Pending mentors", value: stats?.pendingMentors, icon: Hourglass, href: "/internal-hq/mentors", attention: !!stats?.pendingMentors },
    { label: "Scholarships", value: stats?.totalScholarships, icon: GraduationCap },
    { label: "Blogs", value: stats?.totalBlogs, icon: BookOpen },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {tiles.map((t) => (
        <StatTile
          key={t.label}
          label={t.label}
          value={count(t.value ?? 0)}
          icon={t.icon}
          href={t.href}
          attention={t.attention}
          loading={loading}
        />
      ))}
    </div>
  );
}
