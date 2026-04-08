import Image from "next/image";
import { CheckCircle, Coins, NotebookPen, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ForMentorsSection() {
  return (
    <div className="group relative flex flex-col justify-between bg-white backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-3xl p-8 md:p-12 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1 overflow-hidden">
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-bl from-elm/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Small title */}
        <p className="text-elm items-center font-bold tracking-wider mb-4 uppercase text-xs">
          For Mentors
        </p>

        {/* Main heading */}
        <h3 className="text-3xl font-bold leading-tight md:text-4xl text-gray-900">
          Become a mentor <br className="hidden md:block" /> and help others succeed.
        </h3>

        {/* Description */}
        <p className="mt-5 text-gray-600 max-w-md text-base leading-relaxed">
          Share your real study-abroad experience, guide students, and earn extra
          income by helping them through the application journey.
        </p>

        {/* Bullet points */}
        <div className="mt-8 space-y-5">
          {/* Item 1 */}
          <div className="flex items-start gap-4">
            <CheckCircle size={24} className="text-elm shrink-0 mt-0.5" />
            <p className="text-gray-700 font-medium">
              Build your mentor profile and showcase your academic achievements.
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-4">
            <NotebookPen size={24} className="text-elm shrink-0 mt-0.5" />
            <p className="text-gray-700 font-medium">
              Post blogs, share insights, and inspire thousands of students.
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-4">
            <Coins size={24} className="text-elm shrink-0 mt-0.5" />
            <p className="text-gray-700 font-medium">
              Set your fees for CV, SOP review, mentorship sessions, and more.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-10 relative z-10">
        <Link 
          href="/register?role=mentor" 
          className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5"
        >
          Register as Mentor
          <ArrowRight size={18} />
        </Link>
      </div>

    </div>
  );
}
