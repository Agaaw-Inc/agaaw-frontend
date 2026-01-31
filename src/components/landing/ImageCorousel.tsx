"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Start Your Journey",
    subtitle: "Connect with students already living your dream abroad",
    image: "/image01.jpg",
  },
  {
    id: 2,
    title: "Find Your Mentor",
    subtitle: "Get guidance from real students studying abroad",
    image: "/image02.jpg",
  },
  {
    id: 3,
    title: "Achieve Your Dream",
    subtitle: "Explore scholarships and top universities worldwide",
    image: "/harvard-university.jpg",
  },
];

export default function ImageCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">

        {/* IMAGE CONTAINER */}
        <div className="relative mx-auto h-80 w-full max-w-4xl overflow-hidden rounded-2xl shadow-sm">

          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${current === index ? "opacity-100" : "opacity-0"
                }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
              />
            </div>
          ))}

          {/* TEXT OVERLAY — CENTERED */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white drop-shadow-lg">
            <h2 className="text-2xl font-semibold md:text-3xl">
              {slides[current].title}
            </h2>
            <p className="mt-2 text-sm md:text-base opacity-90">
              {slides[current].subtitle}
            </p>
          </div>

          {/* LEFT ARROW */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-elm hover:text-white transition"
          >
            <ChevronLeft size={22} />
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-elm hover:text-white transition"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* DOTS */}
        <div className="mt-6 flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrent(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${current === index ? "bg-elm" : "bg-bombay/40"
                }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
