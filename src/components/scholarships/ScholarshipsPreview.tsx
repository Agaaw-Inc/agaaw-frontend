import ScholarshipCard from "@/components/scholarships/ScholarshipCard";

const sampleScholarships = [
  {
    title: "DAAD Scholarship",
    university: "German Academic Exchange Service",
    deadline: "Dec 15, 2025",
    image: "/images/image03.jpg",
  },
  {
    title: "Erasmus Mundus",
    university: "European Union",
    deadline: "Jan 5, 2026",
    image: "/images/image04.png",
  },
  {
    title: "Fulbright Scholarship",
    university: "U.S. Government",
    deadline: "Oct 1, 2025",
    image: "/images/image05.png",
  },
  {
    title: "Murdoch University",
    university: "Australian Government",
    deadline: "Mar 8, 2026",
    image: "/images/image06.png",
  },
  {
    title: "MEXT",
    university: "Japan Government",
    deadline: "Apr 15, 2026",
    image: "/images/image07.png",
  },

];

export default function ScholarshipsPreview() {
  return (
    <section className="py-20 bg-white px-6 w-full">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Trending <span className="text-teal-700">Scholarships</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {sampleScholarships.map((sch) => (
            <ScholarshipCard
              key={sch.title}
              title={sch.title}
              university={sch.university}
              deadline={sch.deadline}
              image={sch.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}