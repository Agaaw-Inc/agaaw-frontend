import CountryCard from "./CountryCard";
import { COUNTRIES } from "@/data/countries";
import Link from "next/link";

const sampleCountries = [
    { name: "Canada", image: "/countries/canada.jpg" },
    { name: "Germany", image: "/countries/germany.jpg" },
    { name: "Australia", image: "/countries/australia.jpg" },
];

export default function CountryPreview() {
    return (
        <section className="py-20 bg-gray-50 px-6 w-full">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Explore <span className="text-teal-700">Countries</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {Object.values(COUNTRIES).slice(0, 6).map((country) => (
                        <CountryCard
                            key={country.slug}
                            name={country.name}
                            image={country.image}
                        />
                    ))}
                </div>
                <div className="flex justify-center items-center mt-12">
                    <Link href="/countries" className="text-elm font-semibold hover:underline transition-colors">See more countries →</Link>
                </div>
            </div>
        </section>
    );
}
