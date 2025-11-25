import DashboardHeader from "@/components/dashboard/common/DashboardHeader";
import MetricCard from "@/components/dashboard/common/MetricCard";
import MentorProfileCompletionSection from "@/components/dashboard/mentor/MentorProfileCompletionSection";
import MessagesSection from "@/components/dashboard/mentor/MessagesSection";
import PerformanceSection from "@/components/dashboard/mentor/PerformanceSection";
import UpcomingSessionsSection from "@/components/dashboard/mentor/UpcomingSessionsSection";
import TipsSection from "@/components/dashboard/mentor/TipsSection";

import { Users, Star, Wallet, CalendarCheck } from "lucide-react";

export default function MentorDashboardPage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <DashboardHeader
        title="Welcome back, Mentor!"
        subtitle="Help students achieve their dreams today."
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Total Students" value="47" />
        <MetricCard icon={Star} label="Rating" value="4.9" />
        <MetricCard icon={Wallet} label="This Month" value="$2,450" />
        <MetricCard icon={CalendarCheck} label="Sessions" value="12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">

          <MentorProfileCompletionSection
            progress={60}
            checklist={[
              { label: "Profile Photo", checked: true },
              { label: "Bio & Expertise", checked: false },
              { label: "Education & Credentials", checked: false },
              { label: "Service Offerings", checked: true },
              { label: "Availability Schedule", checked: true },
            ]}
          />

          <MessagesSection
            messages={[
              {
                name: "Sarah Johnson",
                message: "Inquiry about UK universities",
                time: "2 hours ago",
                isNew: true,
              },
              {
                name: "Ahmed Hassan",
                message: "Scholarship guidance needed",
                time: "5 hours ago",
              },
              {
                name: "Maria Garcia",
                message: "CV review request",
                time: "1 day ago",
                isNew: true,
              },
            ]}
          />

          <UpcomingSessionsSection
            sessions={[
              {
                student: "John Smith",
                title: "Application Review",
                datetime: "Nov 18, 2025 at 2:00 PM",
              },
              {
                student: "Emily Chen",
                title: "University Selection",
                datetime: "Nov 19, 2025 at 10:00 AM",
              },
              {
                student: "David Park",
                title: "Visa Guidance",
                datetime: "Nov 20, 2025 at 4:00 PM",
              },
            ]}
          />

        </div>

        {/* Right column */}
        <div className="space-y-6">
          <PerformanceSection
            metrics={[
              { label: "Response Rate", value: 95 },
              { label: "Satisfaction", value: 98 },
              { label: "Booking Rate", value: 88 },
            ]}
          />

          <TipsSection
            tips={[
              "Respond quickly to maintain high satisfaction.",
              "Keep your availability updated for more bookings.",
              "Write blog posts to attract additional students.",
            ]}
          />
        </div>
      </div>

    </div>
  );
}
