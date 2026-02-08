import ScholarshipCard from "@/components/scholarships/ScholarshipCard";

const scholarships = [
  {
    title: "DAAD Scholarship",
    university: "German Academic Exchange Service",
    deadline: "Dec 15, 2025",
    slug: "daad-scholarship",
  },
  {
    title: "Erasmus Mundus",
    university: "European Union",
    deadline: "Jan 5, 2026",
    slug: "erasmus-mundus",
  },
  {
    title: "Fulbright Scholarship",
    university: "U.S. Government",
    deadline: "Oct 1, 2025",
    slug: "fulbright-scholarship",
  },
];

export default function ScholarshipsPage() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-center">
        All <span className="text-teal-700">Scholarships</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {scholarships.map((sch) => (
          <ScholarshipCard
            key={sch.slug}
            title={sch.title}
            university={sch.university}
            deadline={sch.deadline}
          />
        ))}
      </div>
    </section>
  );
}