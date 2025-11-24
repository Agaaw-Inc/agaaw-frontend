import { Globe, Users, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    title: "Global Reach",
    desc: "Access universities and opportunities from all around the world.",
    icon: Globe,
  },
  {
    title: "Real Mentors",
    desc: "Get guidance from verified students currently studying abroad.",
    icon: Users,
  },
  {
    title: "No Fraud",
    desc: "Work directly with real mentors and avoid fake agencies.",
    icon: ShieldCheck,
  },
];

export default function WhyChooseSection() {
  return (
    <section className="bg-white mb-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-codgray">
          Why Choose Agaaw?
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-2 max-w-xl text-center text-bombay">
          A platform built to provide authentic mentorship, transparent guidance,
          and global opportunities.
        </p>

        {/* Cards */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm border border-bombay/20 transition hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-elm/10 text-elm mb-4">
                  <Icon size={26} strokeWidth={2} />
                </div>

                <h3 className="text-lg font-semibold text-codgray">{item.title}</h3>

                <p className="mt-2 text-center text-sm text-bombay">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
