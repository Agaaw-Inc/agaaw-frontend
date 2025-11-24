import Image from "next/image";
import { CheckCircle, Coins, NotebookPen } from "lucide-react";

export default function ForMentorsSection() {
  return (
    <div className="flex flex-col justify-center text-white md:pl-8">

      {/* Small title */}
      <p className="text-elm text-sm font-semibold tracking-wide mb-3">
        For Mentors
      </p>

      {/* Main heading */}
      <h3 className="text-2xl font-semibold leading-snug md:text-3xl">
        Become a mentor <br /> and help others succeed.
      </h3>

      {/* Description */}
      <p className="mt-4 text-bombay max-w-md text-sm leading-relaxed">
        Share your real study-abroad experience, guide students, and earn extra
        income by helping them through the application journey.
      </p>

      {/* Bullet points */}
      <div className="mt-6 space-y-4">
        
        {/* Item 1 */}
        <div className="flex items-start gap-3">
          <CheckCircle size={22} className="text-elm mt-1" />
          <p className="text-sm text-white/90">
            Build your mentor profile and showcase your academic achievements.
          </p>
        </div>

        {/* Item 2 */}
        <div className="flex items-start gap-3">
          <NotebookPen size={22} className="text-elm mt-1" />
          <p className="text-sm text-white/90">
            Post blogs, share insights, and inspire thousands of students.
          </p>
        </div>

        {/* Item 3 */}
        <div className="flex items-start gap-3">
          <Coins size={22} className="text-elm mt-1" />
          <p className="text-sm text-white/90">
            Set your fees for CV, SOP review, mentorship sessions, and more.
          </p>
        </div>

      </div>

    </div>
  );
}
