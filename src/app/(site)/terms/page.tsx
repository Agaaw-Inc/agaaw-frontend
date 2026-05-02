"use client";

import React from "react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import { Scale, Clock, ChevronRight } from "lucide-react";

const SECTIONS = [
  { id: "intro", title: "1. Introduction" },
  { id: "eligibility", title: "2. Eligibility" },
  { id: "usage", title: "3. Platform Usage Rules" },
  { id: "interaction", title: "4. Mentor-Student Interaction" },
  { id: "payments", title: "5. Payments & Fees" },
  { id: "responsibilities", title: "6. User Responsibilities" },
  { id: "intellectual-property", title: "7. Intellectual Property" },
  { id: "termination", title: "8. Termination" },
  { id: "liability", title: "9. Limitation of Liability" },
  { id: "changes", title: "10. Changes to Terms" },
];

export default function TermsPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MainNavbar />

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-slate-50 py-20 px-8 border-b border-slate-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-elm/10 rounded-2xl flex items-center justify-center text-elm mx-auto mb-8">
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-codgray mb-4">
              Terms of <span className="text-elm">Service</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-bombay text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>Last Updated: May 2026</span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-8 py-20">
          <div className="flex flex-col lg:flex-row gap-16">

            {/* Sticky Sidebar Navigation */}
            <aside className="lg:w-1/4 hidden lg:block">
              <div className="sticky top-24 space-y-1">
                <p className="text-xs font-bold text-bombay uppercase tracking-widest mb-4 px-4">On this page</p>
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-bombay hover:text-elm hover:bg-elm/5 transition-all flex items-center justify-between group"
                  >
                    {section.title}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </aside>

            {/* Main Content Area */}
            <article className="lg:w-3/4 max-w-3xl prose prose-slate prose-headings:text-codgray prose-headings:font-bold prose-p:text-bombay prose-p:leading-relaxed">
              <div id="intro" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">1. Introduction</h2>
                <p>
                  Welcome to Agaaw. These Terms of Service ("Terms") govern your access to and use of the Agaaw website,
                  mobile applications, and any other services provided by Agaaw (collectively, the "Platform").
                  Agaaw is a global mentorship and scholarship platform designed to connect students with experienced
                  mentors to facilitate academic and career advancement.
                </p>
                <p className="mt-4">
                  By accessing or using our Platform, you agree to be bound by these Terms and our Privacy Policy.
                  If you do not agree to these Terms, you may not access or use the Platform.
                </p>
              </div>

              <div id="eligibility" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">2. Eligibility</h2>
                <p>
                  Our Platform serves two primary roles:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-4 text-bombay">
                  <li>
                    <strong>Students:</strong> Individuals seeking academic guidance, scholarship information,
                    and mentorship. You must be at least 12 years old to create a student account. Also you will
                    be eligible and get access to our future courses (IELTS, GRE etc) and programs.
                  </li>
                  <li>
                    <strong>Mentors:</strong> Individuals with academic or professional expertise who provide
                    guidance to students. Mentors must undergo a verification process and maintain high
                    professional standards. Mentors must have to be a university student or graduate and should
                    have at least 1 year of professional experience. A Mentor will provide 1:1 consultation to
                    the students for their academic and preparation of higher education. A mentor can charge for
                    their time and expertise, and Agaaw will facilitate the payment process.
                  </li>
                </ul>
              </div>

              <div id="usage" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">3. Platform Usage Rules</h2>
                <p>
                  Agaaw is committed to maintaining a safe, transparent, and fraud-free ecosystem. Users agree not to:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-bombay">
                  <li>Provide false or misleading information in their profiles.</li>
                  <li>Impersonate any person or entity.</li>
                  <li>Use the Platform for any illegal or unauthorized purpose.</li>
                  <li>Harass, abuse, or harm other users.</li>
                  <li>Attempt to bypass the Platform's security measures.</li>
                </ul>
              </div>

              <div id="interaction" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">4. Mentor-Student Interaction</h2>
                <p>
                  The core of Agaaw is the relationship between mentors and students. To ensure safety and quality:
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-6 rounded-r-xl">
                  <p className="text-amber-800 font-bold mb-2">Strict Policy on Off-Platform Communication</p>
                  <p className="text-amber-700 text-sm italic">
                    To prevent fraud and ensure platform integrity, all communications and payment arrangements
                    must occur within the Agaaw ecosystem. Bypassing the platform for payments is a violation
                    of these terms and will result in immediate account termination.
                  </p>
                </div>
              </div>

              <div id="payments" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">5. Payments & Fees</h2>
                <p>
                  Agaaw operates on a marketplace model. While access to scholarship information is free,
                  personalized mentorship sessions may incur fees.
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-bombay">
                  <li>Mentors set their own rates based on experience and service type.</li>
                  <li>Agaaw charges a service fee to facilitate the transaction and maintain the platform.</li>
                  <li>Refund policies are handled on a case-by-case basis through our support team.</li>
                </ul>
              </div>

              <div id="responsibilities" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">6. User Responsibilities</h2>
                <p>
                  Users are responsible for maintaining the confidentiality of their account credentials
                  and for all activities that occur under their account. You must notify Agaaw
                  immediately of any unauthorized use of your account.
                </p>
              </div>

              <div id="intellectual-property" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">7. Intellectual Property</h2>
                <p>
                  All content on the Platform, including logos, designs, text, and software, is the property
                  of Agaaw and is protected by international copyright and trademark laws. Users retain
                  ownership of the content they post but grant Agaaw a license to use it for platform operations.
                </p>
              </div>

              <div id="termination" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">8. Termination</h2>
                <p>
                  Agaaw reserves the right to suspend or terminate accounts that violate these Terms,
                  engage in fraudulent activity, or harm the platform's community.
                </p>
              </div>

              <div id="liability" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">9. Limitation of Liability</h2>
                <p>
                  Agaaw is a facilitator of mentorship. While we verify mentors, we are not responsible
                  for the specific outcomes of mentorship sessions or scholarship applications.
                  Users utilize the platform at their own discretion.
                </p>
              </div>

              <div id="changes" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">10. Changes to Terms</h2>
                <p>
                  We may update these Terms from time to time. We will notify users of significant
                  changes by posting the new Terms on the Platform and updating the "Last Updated" date.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
