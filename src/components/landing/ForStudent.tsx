import Image from "next/image";
import { CheckCircle, MessagesSquare, GraduationCap } from "lucide-react";

export default function ForStudentsSection() {
  return (
    <div className="flex flex-col justify-center text-white md:pr-8">

      {/* Small title */}
      <p className="text-elm text-sm font-semibold tracking-wide mb-3">
        For Students
      </p>

      {/* Main heading */}
      <h3 className="text-2xl font-semibold leading-snug md:text-3xl">
        Your study abroad journey <br /> starts here.
      </h3>

      {/* Description */}
      <p className="mt-4 text-bombay max-w-md text-sm leading-relaxed">
        Find mentors, explore scholarships, access top universities, and get
        honest guidance from students who have already made it abroad.
      </p>

      {/* Bullet points */}
      <div className="mt-6 space-y-4">
        
        {/* Item 1 */}
        <div className="flex items-start gap-3">
          <CheckCircle size={22} className="text-elm mt-1" />
          <p className="text-sm text-white/90">
            Personalized step-by-step guidance based on your academic profile.
          </p>
        </div>

        {/* Item 2 */}
        <div className="flex items-start gap-3">
          <MessagesSquare size={22} className="text-elm mt-1" />
          <p className="text-sm text-white/90">
            Direct chat with real students studying abroad — no agents.
          </p>
        </div>

        {/* Item 3 */}
        <div className="flex items-start gap-3">
          <GraduationCap size={22} className="text-elm mt-1" />
          <p className="text-sm text-white/90">
            University shortlisting, scholarship info, and full application support.
          </p>
        </div>

      </div>

    </div>
  );
}
