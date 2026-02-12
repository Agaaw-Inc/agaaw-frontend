import InfoSection from "@/components/ui/InfoSection";
import { COUNTRIES } from "@/data/countries";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";



interface CountryProps {
  params: Promise<{
    country: string;
  }>;
}

export async function generateMetadata({ params }: CountryProps) {
  const { country } = await params;
  const data = COUNTRIES[country.toLowerCase()];

  const title = data
    ? `Study in ${data.name} | Agaaw Scholar`
    : "Study Abroad Country Guide | Agaaw Scholar";

  return {
    title,
    description:
      data?.shortIntro ??
      "Country guide for international students on Agaaw Scholar.",
  };
}

export default async function CountryDetails({ params }: CountryProps) {
  const { country } = await params;
  const key = country.toLowerCase();
  const data = COUNTRIES[key];

  if (!data) {
    return (
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Country not found</h1>
        <p className="text-gray-600">
          We don’t have a full guide for this country yet.
        </p>
      </section>
    );
  }

  return (
    <>
    <MainNavbar />
    <section className="py-16 px-7 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-9">
        <p className="text-sm text-teal-700 font-semibold uppercase">
          Study Abroad Guide
        </p>
        <h1 className="text-4xl font-bold mt-1">Study in {data.name}</h1>
        <p className="text-gray-600 mt-3 max-w-2xl">{data.shortIntro}</p>
      </header>

      <InfoSection title="Opportunities">
        <ul className="list-disc list-inside space-y-1">
          {data.opportunities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </InfoSection>

      <InfoSection title="Top Universities">
        <ul className="list-disc list-inside space-y-1">
          {data.universities.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </InfoSection>

      <InfoSection title="How to Apply">
        <ol className="list-decimal list-inside space-y-1">
          {data.howToApply.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </InfoSection>

      <InfoSection title="When to Apply">
        <p>{data.whenToApply}</p>
      </InfoSection>

      <InfoSection title="Visa Policy">
        <p>{data.visaPolicy}</p>
      </InfoSection>

      <InfoSection title="Average Cost">
        <p>{data.avgCost}</p>
      </InfoSection>

      <InfoSection title="Job Opportunities">
        <ul className="list-disc list-inside space-y-1">
          {data.jobOpportunities.map((job) => (
            <li key={job}>{job}</li>
          ))}
        </ul>
      </InfoSection>
    </section>
     <Footer />
    
    </>
  );
}
