"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Globe2, Loader2 } from "lucide-react";
import SectionCard from "@/components/dashboard/common/SectionCard";
import { getCountries } from "@/lib/api";

const MAX_COUNTRIES = 10;

interface MatchedCountry {
    slug: string;
    name: string;
}

export default function MatchingCountries() {
    const [countries, setCountries] = useState<MatchedCountry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCountries() {
            try {
                setIsLoading(true);
                const data = await getCountries();
                // Placeholder until profile-based matching exists — takes the first N countries.
                setCountries((data || []).slice(0, MAX_COUNTRIES));
            } catch (err) {
                console.error("Failed to fetch matching countries:", err);
                setError("Could not load countries");
            } finally {
                setIsLoading(false);
            }
        }
        fetchCountries();
    }, []);

    return (
        <SectionCard
            title="Countries Matching Your Profile"
            description="Based on your preferences and study interests."
            icon={Globe2}
            className="h-full flex flex-col"
            footer={
                <Link href="/countries" className="text-sm font-semibold text-gray-500 hover:text-teal-600 transition-colors">
                    View all countries
                </Link>
            }
        >
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-teal-700" />
                </div>
            ) : error ? (
                <div className="text-center py-10 text-gray-500 text-sm">{error}</div>
            ) : countries.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">No matching countries yet.</div>
            ) : (
                <div className="flex flex-wrap gap-2.5">
                    {countries.map((country) => (
                        <Link
                            key={country.slug}
                            href={`/countries/${country.slug}`}
                            className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 pl-4 pr-3 py-2 text-sm font-semibold text-gray-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                        >
                            {country.name}
                            <ArrowUpRight size={13} className="text-gray-400 group-hover:text-teal-600 transition-colors" />
                        </Link>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}
