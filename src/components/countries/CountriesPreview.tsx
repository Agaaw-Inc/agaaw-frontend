import CountryCard from "./CountryCard";
import { getCountries } from "@/lib/api";
import Link from "next/link";

export default async function CountryPreview() {
    let countries = [];
    try {
        countries = await getCountries();
    } catch (error) {
        console.error("Failed to fetch preview countries:", error);
    }

    return (
        <section className="py-20 bg-gray-50 px-6 w-full">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Explore <span className="text-teal-700">Countries</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {countries.slice(0, 6).map((country: any) => (
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
