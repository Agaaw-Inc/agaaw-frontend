import StatsGrid from "@/components/admin/StatsGrid";
import RegistrationChart from "@/components/admin/RegistrationChart";
import RevenueChart from "@/components/admin/RevenueChart";
import ActivityFeed from "@/components/admin/ActivityFeed";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RegistrationChart />
        <RevenueChart />
      </div>

      <ActivityFeed />
    </div>
  );
}