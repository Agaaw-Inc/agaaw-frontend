import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center md:justify-start overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="./videos/agaaw-hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 sm:bg-black/40 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 text-left">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-md leading-[1.1]">
            Fly to your <span className="text-elm drop-shadow-lg">Future</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-white/90 font-medium drop-shadow-md leading-relaxed">
            Your all-in-one platform for studying abroad. Connect with mentors,
            find scholarships, and make your dreams a reality.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/register/student"
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-elm text-white rounded-lg font-bold text-lg shadow-lg hover:bg-elm/90 transition-all"
            >
              Start Your Journey
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register/mentor"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-lg font-bold text-lg border border-white/30 hover:bg-white/20 transition-all text-center"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
