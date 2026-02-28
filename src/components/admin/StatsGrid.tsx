import SummaryCard from "./SummaryCard";
import { summaryData } from "@/lib/mock/dashboardData";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <SummaryCard title="Total Students" value={summaryData.totalStudents} />
      <SummaryCard title="Total Mentors" value={summaryData.totalMentors} />
      <SummaryCard title="Countries" value={summaryData.totalCountries} />
      <SummaryCard title="Scholarships" value={summaryData.totalScholarships} />
      <SummaryCard title="Revenue (BDT)" value={`৳${summaryData.totalRevenue}`} />
    </div>
  );
}