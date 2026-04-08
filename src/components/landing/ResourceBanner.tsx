import Image from "next/image";
import Link from "next/link";

export default function ResourceBanner() {
  const resources = [
    {
      id: 1,
      title: "Explore Study Destinations",
      image: "/images/destinations_1775572952159.png",
      href: "/countries"
    },
    {
      id: 2,
      title: "Find Scholarships Ideas",
      image: "/images/scholarships_1775572968641.png",
      href: "/scholarships"
    },
    {
      id: 3,
      title: "Read Excellent Study Abroad Blogs",
      image: "/images/blogs_1775572987724.png",
      href: "/blogs"
    }
  ];

  return (
    <div className="w-full mb-24">
      <div className="flex items-baseline justify-between mb-8">
        <h3 className="text-2xl md:text-4xl font-medium text-gray-800 tracking-tight">
          Guides to help you grow
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {resources.map((resource) => (
          <Link href={resource.href} key={resource.id} className="group flex flex-col">
            {/* Aspect ratio container matching standard blog/video thumbnails */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-gray-100 border border-gray-100/50 shadow-sm transition-shadow group-hover:shadow-md">
              <Image
                src={resource.image}
                alt={resource.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800 transition-colors group-hover:text-elm leading-tight">
              {resource.title}
            </h3>
          </Link>
        ))}
      </div>

      <div className="mt-8 md:hidden flex justify-start">
        <Link
          href="/resources"
          className="text-gray-700 hover:text-black font-semibold transition-colors under text-sm"
        >
          See more guides
        </Link>
      </div>
    </div>
  );
}
