import DashboardHeader from "@/components/dashboard/common/DashboardHeader";
import MetricCard from "@/components/dashboard/common/MetricCard";
import LatestNewsSection from "@/components/dashboard/student/LatestNewsSection";
import UpcomingEventsSection from "@/components/dashboard/student/UpcomingEventsSection";
import StudentProfileProgressSection from "@/components/dashboard/student/StudentProfileProgressSection";

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <LatestNewsSection
            news={[
              {
                category: "Scholarship",
                date: "Nov 15, 2025",
                title: "New Scholarship Opportunities in Germany",
                description: "DAAD announces new funding for international students pursuing STEM degrees.",
              },
              {
                category: "Admission",
                date: "Nov 14, 2025",
                title: "Top Universities Open Applications for Fall 2026",
                description: "Leading universities in the UK and USA are now accepting applications for next year.",
                thumbnail: "/images/news1.jpg",
              },
              {
                category: "Visa",
                date: "Nov 12, 2025",
                title: "Student Visa Updates: What You Need to Know",
                description: "Recent changes to student visa policies across multiple countries.",
                thumbnail: "/images/news2.jpg",
              },
            ]}
          />

          <UpcomingEventsSection
            events={[
              { title: "Virtual University Fair", date: "Nov 20, 2025", type: "online" },
              { title: "Application Workshop", date: "Nov 22, 2025", type: "webinar" },
              { title: "Mentor Meet & Greet", date: "Nov 25, 2025", type: "in-person" },
            ]}
          />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <StudentProfileProgressSection
            progress={75}
            checklist={[
              { label: "Basic Information", checked: true },
              { label: "Academic Background", checked: false },
              { label: "Upload Documents", checked: false },
              { label: "Language Proficiency", checked: true },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
