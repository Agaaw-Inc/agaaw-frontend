import CountryCard from "./CountryCard";

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
                    {sampleCountries.map((country) => (
                        <CountryCard
                            key={country.name}
                            name={country.name}
                            image={country.image}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
