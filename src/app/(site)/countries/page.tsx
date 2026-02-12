import CountryCard from "@/components/countries/CountryCard";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";

const countries = [
    { name: "Canada", image: "/countries/canada.jpg" },
    { name: "Germany", image: "/countries/germany.jpg" },
    { name: "Australia", image: "/countries/australia.jpg" },
];

export default function CountriesPage() {
    return (
<>
<MainNavbar />
        
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
        <Footer />

</>
        
    );
}