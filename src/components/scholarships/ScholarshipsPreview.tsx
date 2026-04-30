import ScholarshipCard from "@/components/scholarships/ScholarshipCard";
import { SCHOLARSHIPS } from "@/data/scholarships";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function ScholarshipsPreview() {
  return (
    <section className="py-20 bg-white px-6 w-full">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Trending <span className="text-teal-700">Scholarships</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Object.values(SCHOLARSHIPS).slice(0, 6).map((sch) => (
            <ScholarshipCard
              key={sch.slug}
              title={sch.name}
              university={sch.provider}
              deadline={sch.deadline}
              image={sch.image}
              funding={sch.funding}
              amount={sch.amount}
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