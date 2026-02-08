import CountryCard from "@/components/countries/CountryCard";

const countries = [
    { name: "Canada", image: "/images/countries/canada.jpg" },
    { name: "Germany", image: "/images/countries/germany.jpg" },
    { name: "Australia", image: "/images/countries/australia.jpg" },
];

export default function CountriesPage() {
    return (
        <section className="py-20 px-6 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-10 text-center">
                Explore <span className="text-teal-700">Countries</span>
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {countries.map((country) => (
                    <CountryCard
                        key={country.name}
                        name={country.name}
                        image={country.image}
                    />
                ))}
            </div>
        </section>
    );
}