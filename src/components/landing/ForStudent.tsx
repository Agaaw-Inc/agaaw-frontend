import Image from "next/image";
import { CheckCircle, MessagesSquare, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ForStudentsSection() {
  return (
    <div className="group relative flex flex-col justify-between bg-white backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-3xl p-8 md:p-12 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1 overflow-hidden">
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-elm/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Small title */}
        <p className="text-elm items-center font-bold tracking-wider mb-4 uppercase text-xs">
          For Students
        </p>

        {/* Main heading */}
        <h3 className="text-3xl font-bold leading-tight md:text-4xl text-gray-900">
          Your study abroad journey <br className="hidden md:block"/> starts here.
        </h3>

        {/* Description */}
        <p className="mt-5 text-gray-600 max-w-md text-base leading-relaxed">
          Find mentors, explore scholarships, access top universities, and get
          honest guidance from students who have already made it abroad.
        </p>

        {/* Bullet points */}
        <div className="mt-8 space-y-5">
          {/* Item 1 */}
          <div className="flex items-start gap-4">
            <CheckCircle size={24} className="text-elm shrink-0 mt-0.5" />
            <p className="text-gray-700 font-medium">
              Personalized step-by-step guidance based on your academic profile.
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-4">
            <MessagesSquare size={24} className="text-elm shrink-0 mt-0.5" />
            <p className="text-gray-700 font-medium">
              Direct chat with real students studying abroad — no agents.
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-4">
            <GraduationCap size={24} className="text-elm shrink-0 mt-0.5" />
            <p className="text-gray-700 font-medium">
              University shortlisting, scholarship info, and full application support.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 relative z-10">
        <Link 
          href="/register?role=student" 
          className="inline-flex items-center justify-center gap-2 bg-elm hover:bg-elm/90 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,118,100,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,100,0.23)] hover:-translate-y-0.5"
        >
          Register as Student
          <ArrowRight size={18} />
        </Link>
      </div>

    </div>
  );
}
