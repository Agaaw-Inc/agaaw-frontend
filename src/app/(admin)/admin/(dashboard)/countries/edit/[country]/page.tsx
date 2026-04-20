import CountryForm from "@/components/admin/country/CountryForm";
import { COUNTRIES } from "@/data/countries";

interface Props {
  params: Promise<{ country: string }>;
}

export default async function EditCountryPage({ params }: Props) {
  const { country } = await params;
  const c = COUNTRIES[country];

  if (!c) return <div className="p-10 text-red-600">Country not found</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Country</h1>

      <CountryForm
        mode="edit"
        defaultValues={{
          slug: c.slug,
          name: c.name,
          shortIntro: c.shortIntro,
          opportunities: c.opportunities,
          universities: c.universities,
          howToApply: c.howToApply,
          whenToApply: c.whenToApply,
          visaPolicy: c.visaPolicy,
          avgCost: c.avgCost,
          jobOpportunities: c.jobOpportunities,
        }}
      />
    </div>
  );
}