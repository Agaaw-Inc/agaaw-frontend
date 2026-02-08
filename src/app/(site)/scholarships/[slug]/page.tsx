import InfoSection from "@/components/ui/InfoSection";
import { SCHOLARSHIPS } from "@/data/scholarships";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const scholarship = SCHOLARSHIPS[slug];

    const title = scholarship ? `${scholarship.name} | Agaaw Scholar` : "Scholarship Details";

    return {
        title,
        description:
            scholarship?.description ??
            "Detailed information about this scholarship on Agaaw Scholar.",
    };
}

export default async function ScholarshipDetails({ params }: PageProps) {
    const { slug } = await params;
    const scholarship = SCHOLARSHIPS[slug];

    if (!scholarship) {
        return (
            <section className="py-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Scholarship not found</h1>
                <p className="text-gray-600">
                    We couldn’t find this scholarship in our database yet.
                </p>
            </section>
        );
    }

    return (<section className="py-16 px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
            <p className="text-sm text-teal-700 font-semibold uppercase">
                {scholarship.provider}
            </p>
            <h1 className="text-4xl font-bold mt-2">{scholarship.name}</h1>
            <p className="text-gray-600 mt-3 max-w-2xl">
                {scholarship.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800">
                    Country: {scholarship.country}
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800">
                    Level: {scholarship.level}
                </span>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800">
                    Deadline: {scholarship.deadline}
                </span>
            </div>
        </div>

        {/* Sections */}
        <InfoSection title="Benefits">
            <ul className="list-disc list-inside space-y-1">
                {scholarship.benefits.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </InfoSection>

        <InfoSection title="Eligibility">
            <ul className="list-disc list-inside space-y-1">
                {scholarship.eligibility.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </InfoSection>

        <InfoSection title="How to Apply">
            <ol className="list-decimal list-inside space-y-1">
                {scholarship.applicationSteps.map((step) => (
                    <li key={step}>{step}</li>
                ))}
            </ol>
        </InfoSection>

        <InfoSection title="Official Website">
            <a
                href={scholarship.officialLink}
                target="_blank"
                rel="noreferrer"
                className="text-teal-700 font-semibold hover:underline"
            >
                Go to official scholarship page →
            </a>
        </InfoSection>
    </section>
    );
}