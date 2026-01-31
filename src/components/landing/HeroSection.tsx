import Link from "next/link";
import { BookOpen, UserRoundCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-[#f6f6f8] py-24 text-center px-6">
      {/* Main Title */}
      <h1 className="text-4xl font-semibold text-codgray">Agaaw</h1>
      <p className="mt-2 text-lg text-codgray/80">Fly to your Future</p>

      {/* Subtitle */}
      <p className="mx-auto mt-6 max-w-2xl text-base text-codgray/70 leading-relaxed">
        Your all-in-one platform for studying abroad. Connect with mentors,
        find scholarships, and make your dreams a reality.
      </p>

      {/* Role Cards */}
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

        {/* Student */}
        <Link
          href="auth/register/student"
          className="flex items-center gap-4 rounded-xl border border-bombay/40 bg-white px-7 py-5 text-sm shadow-sm transition hover:border-elm hover:shadow-md"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-elm/10 text-elm">
            <BookOpen size={20} strokeWidth={2} />
          </div>

          <div className="text-left leading-tight">
            <p className="font-semibold text-codgray">Register as Student</p>
            <p className="text-xs text-bombay">Find your dream university</p>
          </div>
        </Link>

        {/* Consultant */}
        <Link
          href="auth/register/mentor"
          className="flex items-center gap-4 rounded-xl border border-bombay/40 bg-white px-7 py-5 text-sm shadow-sm transition hover:border-elm hover:shadow-md"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-elm/10 text-elm">
            <UserRoundCheck size={20} strokeWidth={2} />
          </div>

          <div className="text-left leading-tight">
            <p className="font-semibold text-codgray">Register as Mentor</p>
            <p className="text-xs text-bombay">Help others achieve their dreams</p>
          </div>
        </Link>

      </div>
    </section>
  );
}
