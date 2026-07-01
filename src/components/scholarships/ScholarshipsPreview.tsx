"use client";

import React, { useState, useEffect } from "react";
import ScholarshipCard from "@/components/scholarships/ScholarshipCard";
import { getScholarships, type PublicScholarship } from "@/lib/api";
import Link from "next/link";
import { Loader2 } from "lucide-react";

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
    full: "Full Coverage",
    partial: "Partial Coverage",
    varies: "Varies",
  }[coverage];
}

export default function ScholarshipsPreview() {
  const [scholarships, setScholarships] = useState<PublicScholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScholarships() {
      try {
        setIsLoading(true);
        const result = await getScholarships({ limit: 6 });
        setScholarships(result.data || []);
      } catch (err) {
        console.error("Failed to fetch trending scholarships:", err);
        setError("Could not load scholarships");
      } finally {
        setIsLoading(false);
      }
    }
    fetchScholarships();
  }, []);

  return (
    <section className="py-20 bg-white px-6 w-full">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Trending <span className="text-teal-700">Scholarships</span>
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-gray-500">{error}</div>
        ) : (
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
        )}
        <div className="flex justify-center items-center mt-12">
          <Link href="/scholarships" className="text-elm font-semibold hover:underline transition-colors">See more scholarships →</Link>
        </div>
      </div>
    </section>
  );
}
