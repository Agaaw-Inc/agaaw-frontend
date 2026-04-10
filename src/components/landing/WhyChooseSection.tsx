"use client";

import { motion } from "framer-motion";
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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-center text-4xl md:text-5xl font-medium tracking-tight leading-tight text-codgray"
        >
          Why Choose Agaaw?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
          className="mx-auto mt-4 max-w-2xl text-center text-base md:text-lg text-bombay leading-relaxed"
        >
          A platform built to provide authentic mentorship, transparent guidance,
          and global opportunities.
        </motion.p>

        {/* Cards */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.15,
                  ease: "easeOut",
                }}
                viewport={{ once: false }}

                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 0 18px rgba(29, 122, 133, 0.35), 0 0 30px rgba(29, 122, 133, 0.18)",
                  transition: { duration: 0.25, ease: "easeOut" },
                }}

                className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm border border-bombay/20"
              >
                {/* Icon Bubble */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-elm/10 text-elm mb-4">
                  <Icon size={26} strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-codgray">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-center text-base text-bombay">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
