import CountryCard from "@/components/countries/CountryCard";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import { Search, ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { COUNTRIES } from "@/data/countries";

export default function CountriesPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <MainNavbar />

            <main className="flex-grow pt-16 pb-20">
                {/* Hero Section */}
                <section className="relative px-6 pt-2 pb-15 max-w-7xl mx-auto overflow-hidden">
                    <div className="relative z-10 lg:w-2/3">
                        <span className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-widest uppercase rounded-full bg-elm/10 text-elm">
                            Global Destinations
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-codgray mb-6 leading-[1.1]">
                            Explore <br />
                            <span className="text-elm">Countries</span>
                        </h1>
                        <p className="text-lg md:text-xl text-bombay max-w-xl leading-relaxed mb-10">
                            Discover top-tier educational opportunities across the globe. Choose a
                            destination to explore universities, culture, and student life.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="bg-codgray text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 ambient-shadow hover:bg-codgray/90 transition-colors">
                                Discover Destinations <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="px-8 py-4 rounded-lg font-bold text-codgray hover:bg-slate-100 transition-colors">
                                View Rankings
                            </button>
                        </div>
                    </div>
                    {/* World Map Decorative Element */}
                    <div className="absolute top-0 right-[-5%] w-[60%] h-full pointer-events-none hidden lg:block opacity-15">
                        <div 
                            className="w-full h-full bg-[#20B2AA]"
                            style={{
                                maskImage: "url('/world-map.svg')",
                                WebkitMaskImage: "url('/world-map.svg')",
                                maskSize: "contain",
                                WebkitMaskSize: "contain",
                                maskRepeat: "no-repeat",
                                WebkitMaskRepeat: "no-repeat",
                                maskPosition: "center right",
                                WebkitMaskPosition: "center right"
                            }}
                        ></div>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="px-8 mb-12 max-w-7xl mx-auto">
                    <div className="bg-slate-50 p-2 rounded-xl flex flex-col md:flex-row gap-2 border border-slate-100">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-elm" />
                            <input
                                className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg focus:ring-2 focus:ring-elm/20 outline-none text-codgray shadow-sm"
                                placeholder="Search by country, region, or city..."
                                type="text"
                            />
                        </div>
                        <div className="flex md:flex-row flex-col gap-2">
                            <div className="relative group">
                                <select className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm">
                                    <option>Region</option>
                                    <option>Europe</option>
                                    <option>North America</option>
                                    <option>Asia</option>
                                    <option>Oceania</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
                            </div>
                            <div className="relative group">
                                <select className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm">
                                    <option>Language</option>
                                    <option>English</option>
                                    <option>German</option>
                                    <option>French</option>
                                    <option>Japanese</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-6 items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-bombay pr-2">Popular:</span>
                        <button className="px-4 py-1.5 bg-elm/10 text-elm rounded-full text-xs font-medium">Europe</button>
                        <button className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors">Study in English</button>
                        <button className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors">Post-Study Visa</button>
                        <button className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors">Low Tuition</button>
                    </div>
                </section>

                {/* Grid Section */}
                <section className="py-12 px-6 max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Popular Destinations</h2>
                        <span className="text-sm font-medium text-teal-700 cursor-pointer hover:underline">View All</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.values(COUNTRIES).map((country) => (
                            <CountryCard
                                key={country.name}
                                name={country.name}
                                image={country.image}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-20 flex justify-center items-center gap-2">
                        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-bombay hover:bg-slate-100 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-codgray text-white font-bold ambient-shadow">1</button>
                        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-codgray hover:bg-slate-100 transition-colors font-medium">2</button>
                        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-codgray hover:bg-slate-100 transition-colors font-medium">3</button>
                        <span className="px-2 text-bombay">...</span>
                        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-codgray hover:bg-slate-100 transition-colors font-medium">12</button>
                        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-bombay hover:bg-slate-100 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}