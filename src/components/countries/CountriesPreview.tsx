"use client";

import React, { useState, useEffect } from "react";
import CountryCard from "./CountryCard";
import { getCountries } from "@/lib/api";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function CountryPreview() {
    const [countries, setCountries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCountries() {
            try {
                setIsLoading(true);
                const data = await getCountries();
                setCountries(data);
            } catch (err) {
                console.error("Failed to fetch preview countries:", err);
                setError("Could not load countries");
            } finally {
                setIsLoading(false);
            }
        }
        fetchCountries();
    }, []);

    return (
        <section className="py-20 bg-gray-50 px-6 w-full">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Explore <span className="text-teal-700">Countries</span>
                </h2>

                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-gray-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {countries.slice(0, 6).map((country: any) => (
                            <CountryCard
                                key={country.slug}
                                name={country.name}
                                slug={country.slug}
                                image={country.image}
                            />
                        ))}
                    </div>
                )}
                <div className="flex justify-center items-center mt-12">
                    <Link href="/countries" className="text-elm font-semibold hover:underline transition-colors">See more countries →</Link>
                </div>
            </div>
        </section>
    );
}
