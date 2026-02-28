import ScholarshipForm from "@/components/admin/scholarship/ScholarshipForm";
import { SCHOLARSHIPS } from "@/data/scholarships";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditScholarship({ params }: Props) {
  const { slug } = await params;
  const s = SCHOLARSHIPS[slug];

  if (!s) return <div className="p-10 text-red-600">Not found</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Scholarship</h1>

      <ScholarshipForm
        mode="edit"
        defaultValues={{
          slug: s.slug,
          name: s.name,
          provider: s.provider,
          country: s.country,
          level: s.level,
          deadline: s.deadline, // later convert to ISO date
          description: s.description,
          benefits: s.benefits,
          eligibility: s.eligibility,
          applicationSteps: s.applicationSteps,
          officialLink: s.officialLink,
        }}
      />
    </div>
  );
}