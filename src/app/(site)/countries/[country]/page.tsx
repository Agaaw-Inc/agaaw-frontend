import InfoSection from "@/components/ui/InfoSection";
import { COUNTRIES } from "@/data/countries";

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
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
      <p className="text-gray-600">{data.shortIntro}</p>
    </section>
  );
}
