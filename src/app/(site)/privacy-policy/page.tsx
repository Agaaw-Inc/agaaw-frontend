"use client";

import React from "react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import { ShieldCheck, Clock, ChevronRight, Lock } from "lucide-react";

const SECTIONS = [
  { id: "collection", title: "1. Information We Collect" },
  { id: "usage", title: "2. How We Use Information" },
  { id: "sharing", title: "3. Data Sharing" },
  { id: "security", title: "4. Data Security" },
  { id: "cookies", title: "5. Cookies & Tracking" },
  { id: "rights", title: "6. User Rights" },
  { id: "third-party", title: "7. Third-Party Services" },
  { id: "updates", title: "8. Updates to Policy" },
  { id: "contact", title: "9. Contact Us" },
];

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-codgray mb-4">
              Privacy <span className="text-elm">Policy</span>
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
                <p className="text-xs font-bold text-bombay uppercase tracking-widest mb-4 px-4">Privacy Guide</p>
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

              <div className="bg-elm/5 border border-elm/20 p-6 rounded-2xl mb-12 flex items-start gap-4">
                <Lock className="w-6 h-6 text-elm mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-codgray mb-1">Our Privacy Commitment</h4>
                  <p className="text-sm text-bombay leading-relaxed">
                    At Agaaw, your data privacy is not just a legal requirement, it's a core value.
                    We are dedicated to being transparent about how we collect, use, and protect your information
                    as you navigate your global education journey.
                  </p>
                </div>
              </div>

              <div id="collection" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">1. Information We Collect</h2>
                <p>We collect information that allows us to provide a personalized and secure experience:</p>
                <ul className="list-disc pl-6 mt-4 space-y-4 text-bombay">
                  <li>
                    <strong>Personal Information:</strong> Name, email address, phone number, and account credentials.
                  </li>
                  <li>
                    <strong>Academic Data:</strong> Educational background, university preferences, scholarship interests,
                    and relevant documents uploaded for mentor review.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Information on how you interact with the Platform, including log data,
                    device information, and communication history within the system.
                  </li>
                </ul>
              </div>

              <div id="usage" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">2. How We Use Information</h2>
                <p>Agaaw uses your data to facilitate the core functions of our mentorship ecosystem:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-bombay">
                  <li>To create and manage your secure user account.</li>
                  <li>To match students with the most relevant mentors based on academic goals.</li>
                  <li>To process transactions and mentorship session bookings.</li>
                  <li>To improve our Platform's performance and user interface.</li>
                  <li>To send important updates regarding scholarships and platform features.</li>
                </ul>
              </div>

              <div id="sharing" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">3. Data Sharing</h2>
                <p className="font-semibold text-codgray">We do not sell your personal data to third parties.</p>
                <p className="mt-4">
                  Information is shared only in the following contexts:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-bombay">
                  <li>
                    <strong>Between Mentors & Students:</strong> Limited profile information is shared
                    to facilitate the mentorship relationship.
                  </li>
                  <li>
                    <strong>Service Providers:</strong> We work with trusted partners for hosting,
                    payment processing, and security, all of whom are bound by strict confidentiality.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> If required by law to protect our rights or comply
                    with a judicial proceeding.
                  </li>
                </ul>
              </div>

              <div id="security" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">4. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your information,
                  including SSL encryption for all data transmissions and secure hashed storage
                  for passwords. However, no method of transmission over the internet is 100% secure,
                  and we encourage users to maintain strong account security.
                </p>
              </div>

              <div id="cookies" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">5. Cookies & Tracking</h2>
                <p>
                  Agaaw uses cookies to remember your preferences, keep you logged in, and analyze
                  how the Platform is used. You can manage your cookie preferences through your
                  browser settings at any time.
                </p>
              </div>

              <div id="rights" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">6. User Rights</h2>
                <p>Depending on your location, you have rights regarding your personal data:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-bombay">
                  <li><strong>Access:</strong> Request a copy of the data we hold about you.</li>
                  <li><strong>Correction:</strong> Update or fix any inaccurate information.</li>
                  <li><strong>Deletion:</strong> Request that we delete your personal data from our systems.</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format.</li>
                </ul>
              </div>

              <div id="third-party" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">7. Third-Party Services</h2>
                <p>
                  Our Platform may contain links to third-party scholarship websites or universities.
                  Agaaw is not responsible for the privacy practices of these external sites,
                  and we recommend reviewing their individual policies.
                </p>
              </div>

              <div id="updates" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">8. Updates to Policy</h2>
                <p>
                  We may update this Privacy Policy to reflect changes in our practices or legal obligations.
                  Significant updates will be communicated through the Platform or via email.
                </p>
              </div>

              <div id="contact" className="mb-16">
                <h2 className="text-3xl font-bold text-codgray mb-6">9. Contact Us</h2>
                <p>
                  If you have any questions or concerns regarding this Privacy Policy, please contact our
                  Privacy Officer at:
                </p>
                <div className="mt-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl inline-block">
                  <p className="text-codgray font-bold">Agaaw Privacy Team</p>
                  <a href="mailto:privacy@agaaw.com" className="text-elm font-medium hover:underline">privacy@agaaw.com</a>
                </div>
              </div>

            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
