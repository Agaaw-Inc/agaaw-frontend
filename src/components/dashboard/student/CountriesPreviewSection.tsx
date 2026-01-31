"use client";

import Link from "next/link";
import Image from "next/image";

// Mock Data
const COUNTRIES = [
    {
        slug: "germany",
        name: "Germany",
        image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800",
    },
    {
        slug: "uk",
        name: "United Kingdom",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800",
    },
    {
        slug: "usa",
        name: "United States",
        image: "https://images.unsplash.com/photo-1627566206014-4861054fd86f?auto=format&fit=crop&q=80&w=800",
    },
];

export default function CountriesPreviewSection() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Explore <span className="text-teal-600">Countries</span>
                </h2>
                <Link
                    href="/countries"
                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {COUNTRIES.map((country) => (
                    <Link
                        key={country.slug}
                        href={`/countries/${country.slug}`}
                        className="group block relative h-48 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all pl-0"
                    >
                        <Image
                            src={country.image}
                            alt={country.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                            <h3 className="text-white font-bold text-lg">{country.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
