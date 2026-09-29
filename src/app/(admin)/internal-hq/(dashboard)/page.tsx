"use client";

/**
 * Admin Dashboard Page
 *
 * Everything here is real data:
 *   - Income & orders: GET /admin/payments/analytics (needs the `payments` permission)
 *   - Sign-ups:        GET /admin/dashboard/registrations
 *   - Platform counts + recent activity: GET /admin/dashboard/stats
 *
 * One range filter at the top scopes every chart. Buckets are cut in
 * Bangladesh time on the server.
 */

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock,
  HandCoins,
  Landmark,
  Package,
  PackageCheck,
  Undo2,
  Wallet,
  Briefcase,
} from "lucide-react";
import StatsGrid from "@/components/admin/StatsGrid";
import RegistrationChart from "@/components/admin/RegistrationChart";
import ActivityFeed from "@/components/admin/ActivityFeed";
import RangeFilter, { rangeLabel } from "@/components/admin/analytics/RangeFilter";
import StatTile from "@/components/admin/analytics/StatTile";
import IncomeChart from "@/components/admin/analytics/IncomeChart";
import OrdersActivityChart from "@/components/admin/analytics/OrdersActivityChart";
import { count, taka } from "@/components/admin/analytics/chartTheme";
import {
  getDashboardStats,
  getOrderAnalytics,
  getRegistrationStats,
  type OrderAnalytics,
  type RegistrationBucket,
  type StatsRange,
} from "@/lib/adminApi";
import type { DashboardStatsResponse, ActivityLog } from "@/lib/adminTypes";

/** A fetch whose previous result stays on screen while the next one loads. */
interface Loadable<T> {
  data: T | null;
  /** The range `data` belongs to — lets us tell "first load" from "refetch". */
  range: StatsRange | null;
  error: string | null;
}

const errorText = (err: unknown) => (err instanceof Error ? err.message : "Failed to load");

function SectionError({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <p>{message}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [range, setRange] = useState<StatsRange>("30d");

  const [analytics, setAnalytics] = useState<Loadable<OrderAnalytics>>({ data: null, range: null, error: null });
  const [signups, setSignups] = useState<Loadable<RegistrationBucket[]>>({ data: null, range: null, error: null });
  const [stats, setStats] = useState<DashboardStatsResponse["overview"] | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Range-scoped data — refetched whenever the filter changes.
  useEffect(() => {
    let alive = true;
    getOrderAnalytics(range)
      .then((data) => alive && setAnalytics({ data, range, error: null }))
      .catch((err) => alive && setAnalytics((prev) => ({ ...prev, range, error: errorText(err) })));
    getRegistrationStats(range)
      .then((data) => alive && setSignups({ data, range, error: null }))
      .catch((err) => alive && setSignups((prev) => ({ ...prev, range, error: errorText(err) })));
    return () => {
      alive = false;
    };
  }, [range]);

  // All-time platform counts — fetched once.
  useEffect(() => {
    let alive = true;
    getDashboardStats()
      .then((data) => {
        if (!alive) return;
        setStats(data.overview);
        setActivities(data.recentActivity || []);
      })
      .catch((err) => alive && setStatsError(errorText(err)))
      .finally(() => alive && setStatsLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const a = analytics.data;
  const firstLoad = analytics.range === null;
  const refreshing = !firstLoad && analytics.range !== range;
  const rangeText = rangeLabel(range).toLowerCase();
  const signupsUnit = range === "7d" || range === "30d" ? "day" : "month";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Filter row — scopes every chart and range tile below */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-500">Income and activity, in Bangladesh time.</p>
        </div>
        <RangeFilter value={range} onChange={setRange} />
      </div>

      {/* ── Income & orders ─────────────────────────────── */}
      <section className="space-y-4" aria-labelledby="income-heading">
        <h3 id="income-heading" className="sr-only">Income and orders</h3>

        {analytics.error && !a ? (
          <SectionError
            message={`Income data unavailable: ${analytics.error}. Viewing it needs the "payments" read permission.`}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
              <StatTile
                accent
                icon={Banknote}
                label="Agaaw income"
                value={taka(a?.totals.income ?? 0)}
                sub={a ? `${taka(a.snapshot.incomeAllTime)} all time` : undefined}
                loading={firstLoad}
              />
              <StatTile
                icon={HandCoins}
                label="Payments received"
                value={taka(a?.totals.received ?? 0)}
                sub="Verified student payments"
                loading={firstLoad}
              />
              <StatTile icon={Package} label="Orders placed" value={count(a?.totals.orders ?? 0)} loading={firstLoad} />
              <StatTile icon={PackageCheck} label="Delivered" value={count(a?.totals.delivered ?? 0)} loading={firstLoad} />
              <StatTile
                icon={Undo2}
                label="Refunded"
                value={count(a?.totals.refunded ?? 0)}
                sub={a ? `${taka(a.totals.refundedAmount)} returned` : undefined}
                loading={firstLoad}
              />
              <StatTile
                icon={Briefcase}
                label="Services listed"
                value={count(a?.snapshot.servicesListed ?? 0)}
                sub={a ? `by ${count(a.snapshot.mentorsWithServices)} mentor${a.snapshot.mentorsWithServices === 1 ? "" : "s"}` : undefined}
                loading={firstLoad}
              />
            </div>

            {/* Where the money stands right now — not affected by the range */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Right now</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatTile
                  icon={Landmark}
                  label="Held for active orders"
                  value={taka(a?.snapshot.heldForActiveOrders ?? 0)}
                  sub={a ? `${count(a.snapshot.activeOrders)} orders · ${taka(a.snapshot.expectedIncome)} expected income` : undefined}
                  loading={firstLoad}
                />
                <StatTile
                  icon={Wallet}
                  label="Owed to mentors"
                  value={taka(a?.snapshot.owedToMentors ?? 0)}
                  sub={a ? `${taka(a.snapshot.paidOutToMentors)} paid out so far` : undefined}
                  loading={firstLoad}
                />
                <StatTile
                  icon={Clock}
                  label="Awaiting verification"
                  value={taka(a?.snapshot.awaitingVerification ?? 0)}
                  sub={a ? `${count(a.snapshot.awaitingVerificationCount)} payment${a.snapshot.awaitingVerificationCount === 1 ? "" : "s"} to check` : undefined}
                  href="/internal-hq/payments"
                  attention={!!a?.snapshot.awaitingVerificationCount}
                  loading={firstLoad}
                />
                <StatTile
                  icon={a?.snapshot.refundsOwedCount ? Undo2 : CheckCircle2}
                  label="Refunds to send"
                  value={taka(a?.snapshot.refundsOwed ?? 0)}
                  sub={a ? `${count(a.snapshot.refundsOwedCount)} order${a.snapshot.refundsOwedCount === 1 ? "" : "s"}` : undefined}
                  href="/internal-hq/payments"
                  attention={!!a?.snapshot.refundsOwedCount}
                  loading={firstLoad}
                />
              </div>
            </div>

            {analytics.error && a && <SectionError message={`Couldn't refresh: ${analytics.error}`} />}

            <IncomeChart data={a} loading={firstLoad} refreshing={refreshing} rangeText={rangeText} />
          </>
        )}

        {/* Full width: up to 30 buckets × 3 bars need the room */}
        {!(analytics.error && !a) && (
          <OrdersActivityChart data={a} loading={firstLoad} refreshing={refreshing} rangeText={rangeText} />
        )}
        <div>
          {signups.error && !signups.data ? (
            <SectionError message={`Sign-up data unavailable: ${signups.error}`} />
          ) : (
            <RegistrationChart
              data={signups.data ?? []}
              unit={signupsUnit}
              loading={signups.range === null}
              refreshing={signups.range !== null && signups.range !== range}
              rangeText={rangeText}
            />
          )}
        </div>
      </section>

      {/* ── Platform ────────────────────────────────────── */}
      <section className="space-y-3" aria-labelledby="platform-heading">
        <h3 id="platform-heading" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Platform · all time
        </h3>
        {statsError ? <SectionError message={`Platform stats unavailable: ${statsError}`} /> : <StatsGrid stats={stats} isLoading={statsLoading} />}
      </section>

      <ActivityFeed activities={activities} isLoading={statsLoading} />
    </div>
  );
}
