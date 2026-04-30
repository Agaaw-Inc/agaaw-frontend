"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MentorBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const mentors = [
    { id: 1, name: "David Chen", role: "UK Studies", image: "/images/mentor_1_1775572865660.png" },
    { id: 2, name: "Sarah Jenkins", role: "Oxford Alumni", image: "/images/mentor_2_1775572883225.png" },
    { id: 3, name: "Michael Ross", role: "MIT Alumni", image: "/images/mentor_3_1775572899845.png" },
    { id: 4, name: "Elena Martinez", role: "Stanford Alumni", image: "/images/mentor_4_1775572933625.png" },
    { id: 5, name: "James Wilson", role: "Cambridge Alumni", image: "/images/mentor_1_1775572865660.png" },
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      // Move to the next index, creating an infinite loop
      // How the infinite loop works: Rather than just saying current + 1 
      // (which would eventually go to 5, 6, 7 and break because we only have 5 images), 
      // we use % mentors.length (Modulo operation). 
      // When the index hits 5, the math says 5 % 5 = 0, bringing it back seamlessly to the first image.
      setActiveIndex((current) => (current + 1) % mentors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, mentors.length]);

  const getPosition = (index: number) => {
    const diff = (index - activeIndex + mentors.length) % mentors.length;
    if (diff === 0) return 0;
    if (diff === 1) return 1;
    if (diff === 2) return 2;
    if (diff === 3) return -2;
    if (diff === 4) return -1;
    return 0;
  };

  return (
    <div className="bg-black text-white rounded-[2rem] overflow-hidden shadow-2xl relative w-full mb-20">
      <div className="flex flex-col lg:flex-row items-center min-h-[440px]">
        {/* Text Content */}
        <div className="p-10 md:p-16 lg:w-1/2 flex flex-col justify-center z-10">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-6">
            Connect with the real mentors
          </h2>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-6 hidden">
            Become a mentor<br />to help others
          </h2>
          <p className="text-gray-300 text-base md:text-lg mb-8 max-w-md leading-relaxed">
            From picking universities to the final application, work with the most renowned student Mentors to guide others through the journey and earn real impact.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register?role=mentor"
              className="inline-flex items-center justify-center bg-white text-black font-semibold py-3.5 px-8 rounded-full transition-all duration-300 hover:bg-gray-200 hover:scale-[1.02] w-max"
            >
              Find your Mentor
            </Link>
            {/* add some space between the two buttons */}
            <Link
              href="/register?role=mentor"
              className="inline-flex items-center justify-center bg-white text-black font-semibold py-3.5 px-8 rounded-full transition-all duration-300 hover:bg-gray-200 hover:scale-[1.02] w-max"
            >
              Become a Mentor
            </Link>
          </div>
        </div>

        {/* Carousel / Image section */}
        <div className="lg:w-1/2 w-full relative h-[400px] lg:h-[440px] flex items-center justify-center overflow-hidden bg-black/50">
          {/* Gradient fade on edges to blend with black */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-50 hidden lg:block pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-50 hidden lg:block pointer-events-none" />

          <div
            className="relative w-full h-full flex items-center justify-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {mentors.map((mentor, index) => {
              const position = getPosition(index);

              let styleClasses = "";
              let zIndex = 0;

              switch (position) {
                case 0:
                  styleClasses = "translate-x-0 scale-100 opacity-100 blur-0 brightness-100 shadow-[0_0_30px_rgba(255,255,255,0.15)]";
                  zIndex = 40;
                  break;
                case 1:
                  styleClasses = "translate-x-[75%] scale-[0.85] opacity-90 blur-0 brightness-[0.6] shadow-xl";
                  zIndex = 30;
                  break;
                case -1:
                  styleClasses = "-translate-x-[75%] scale-[0.85] opacity-90 blur-0 brightness-[0.6] shadow-xl";
                  zIndex = 30;
                  break;
                case 2:
                  styleClasses = "translate-x-[140%] scale-[0.70] opacity-60 blur-[3px] brightness-50 shadow-lg";
                  zIndex = 20;
                  break;
                case -2:
                  styleClasses = "-translate-x-[140%] scale-[0.70] opacity-60 blur-[3px] brightness-50 shadow-lg";
                  zIndex = 20;
                  break;
              }

              return (
                <div
                  key={mentor.id}
                  className={`absolute w-[160px] h-[240px] rounded-xl overflow-hidden border border-white/10 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer ${styleClasses}`}
                  style={{ zIndex }}
                  onClick={() => setActiveIndex(index)}
                >
                  <Image
                    src={mentor.image}
                    alt={mentor.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-gray-300 truncate mb-0.5">{mentor.role}</p>
                    <p className="text-sm font-semibold truncate leading-tight">{mentor.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
