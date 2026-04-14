import ScholarshipCard from "@/components/scholarships/ScholarshipCard";
import MainNavbar from "@/components/navbar/MainNavbar";
import ImageCarousel from "@/components/landing/ImageCorousel";
import Footer from "@/components/landing/Footer";

const scholarships = [
  {
    title: "DAAD Scholarship",
    university: "German Academic Exchange Service",
    deadline: "Dec 15, 2025",
    slug: "daad-scholarship",
    image: "/images/image03.jpg",
  },
  {
    title: "Erasmus Mundus",
    university: "European Union",
    deadline: "Jan 5, 2026",
    slug: "erasmus-mundus",
    image: "/images/image04.png",
  },
  {
    title: "Fulbright Scholarship",
    university: "U.S. Government",
    deadline: "Oct 1, 2025",
    slug: "fulbright-scholarship",
    image: "/images/image05.png",
  },
  {
    title: "Murdoch University",
    university: "Australian Government",
    deadline: "Mar 8, 2026",
    slug: "murdoch-university",
    image: "/images/image06.png",
  },
  {
    title: "MEXT",
    university: "Japan Government",
    deadline: "Apr 15, 2026",
    slug: "mext",
    image: "/images/image07.png",
  },
];

export default function ScholarshipsPage() {
  return (
    <>
      <MainNavbar />
      
      <div className="bg-gradient-to-b from-white to-slate-50 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-slate-700 font-light leading-relaxed">
            Your journey to global excellence starts here.{" "}
            <span className="font-semibold text-teal-700">Believe in your potential</span> and discover the opportunities that can transform your future.
          </p>
        </div>
      </div>

      <ImageCarousel />
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
              image={sch.image}
            />
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}