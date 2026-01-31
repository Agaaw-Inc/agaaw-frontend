import DashboardHeader from "@/components/dashboard/common/DashboardHeader";
import MetricCard from "@/components/dashboard/common/MetricCard";
import MentorsSection from "@/components/dashboard/student/MentorsSection";
import ScholarshipsPreviewSection from "@/components/dashboard/student/ScholarshipsPreviewSection";
import CountriesPreviewSection from "@/components/dashboard/student/CountriesPreviewSection";

import { Users, University, TrendingUp } from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <DashboardHeader
        title="Welcome back, Student!"
        subtitle="Here’s what’s happening with your journey today."
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard icon={Users} label="Active Mentors" value="156" />
        <MetricCard icon={University} label="Universities" value="500+" />
        <MetricCard icon={TrendingUp} label="Success Rate" value="94%" />
      </div>

      {/* Grid: News (left) + Actions/Progress (right) */}
      {/* Mentors Section */}
      <MentorsSection />

      {/* Main Content Grid: Scholarships & Countries */}
      <div className="space-y-8">
        <ScholarshipsPreviewSection />
        <CountriesPreviewSection />
      </div>

      {/* Keep the old news/events as a lower priority or remove if strictly following 'like agaaw_scholarships' 
          For now, I will comment them out or remove them to strictly follow the 'page like what agaaw_scholarship has' request,
          as sticking to the requested design is safer.
      */}
    </div>
  );
}
