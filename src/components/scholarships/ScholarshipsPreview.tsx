import ScholarshipCard from "@/components/scholarships/ScholarshipCard";
import { getScholarships, type PublicScholarship } from "@/lib/api";
import Link from "next/link";

const FALLBACK_IMAGE = "/images/scholarship-agaaw.png";

function formatDeadline(deadline: string | null) {
  if (!deadline) return "Ongoing";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(deadline));
}

function formatCoverage(coverage: PublicScholarship["coverage"]) {
  return {
    fully_funded: "Full Coverage",
    partial: "Partial Coverage",
    varies: "Varies",
  }[coverage];
}

export default async function ScholarshipsPreview() {
  const result = await getScholarships({ limit: 6 });
  const scholarships = result.data;

  return (
    <section className="py-20 bg-white px-6 w-full">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Trending <span className="text-teal-700">Scholarships</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {scholarships.map((sch) => (
            <ScholarshipCard
              key={sch.slug}
              title={sch.name}
              university={sch.provider}
              deadline={formatDeadline(sch.deadline)}
              image={sch.bannerImage || FALLBACK_IMAGE}
              funding={formatCoverage(sch.coverage)}
              amount={sch.amount || undefined}
              slug={sch.slug}
            />
          ))}
        </div>
        <div className="flex justify-center items-center mt-12">
          <Link href="/scholarships" className="text-elm font-semibold hover:underline transition-colors">See more scholarships →</Link>
        </div>
      </div>
    </section>
  );
}
