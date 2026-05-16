"use client";

/**
 * Admin Dashboard Page
 *
 * Main landing page for the admin panel.
 * Fetches real dashboard statistics from the backend API
 * and passes them to child components.
 *
 * - StatsGrid: shows overview numbers (users, mentors, scholarships, etc.)
 * - RegistrationChart + RevenueChart: still use mock data (no backend API yet)
 * - ActivityFeed: shows the most recent admin actions
 */

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import StatsGrid from "@/components/admin/StatsGrid";
import RegistrationChart from "@/components/admin/RegistrationChart";
import RevenueChart from "@/components/admin/RevenueChart";
import ActivityFeed from "@/components/admin/ActivityFeed";
import { getDashboardStats } from "@/lib/adminApi";
import type { DashboardStatsResponse, ActivityLog } from "@/lib/adminTypes";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatsResponse["overview"] | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [registrationData, setRegistrationData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getDashboardStats();

        if (!cancelled) {
          setStats(data.overview);
          setActivities(data.recentActivity || []);
          setRegistrationData(data.registrationStats || []);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load dashboard";
          setError(message);
          console.error("[Dashboard] Fetch error:", err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-medium">Failed to load dashboard</p>
            <p className="text-red-500 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <StatsGrid stats={stats} isLoading={isLoading} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RegistrationChart data={registrationData} isLoading={isLoading} />
        <RevenueChart />
      </div>

      {/* Recent admin actions */}
      <ActivityFeed activities={activities} isLoading={isLoading} />
    </div>
  );
}