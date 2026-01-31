"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Mock Data for Mentors
const MENTORS = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    name: `Mentor ${i + 1}`,
    role: "Senior Engineer",
    company: "Google",
    image: `https://i.pravatar.cc/150?u=${i + 10}`, // using random avatars
}));

export default function MentorsSection() {
    return (
        <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Choose Your <span className="text-teal-600">Mentor</span>
                </h2>
                <Link
                    href="/mentors"
                    className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 group"
                >
                    See All Mentors
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Marquee Container */}
            <div
                className="relative w-full overflow-hidden"
                style={{
                    maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                }}
            >
                {/* We duplicate the list to ensure seamless looping */}
                <div className="flex w-max">
                    <MentorsList />
                    <MentorsList />
                </div>
            </div>
        </section>
    );
}

function MentorsList() {
    return (
        <motion.div
            className="flex gap-6 pr-6"
            animate={{ x: "-100%" }}
            transition={{
                ease: "linear",
                duration: 30, // Adjust speed here
                repeat: Infinity,
            }}
        >
            {MENTORS.map((mentor, index) => (
                <div key={`${mentor.id}-${index}`} className="flex flex-col items-center group cursor-pointer w-[100px]">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-teal-500 transition-colors shadow-sm">
                        <Image
                            src={mentor.image}
                            alt={mentor.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-gray-800 text-center truncate w-full">
                        {mentor.name}
                    </p>
                    <p className="text-xs text-gray-500 text-center truncate w-full">
                        {mentor.role}
                    </p>
                </div>
            ))}
        </motion.div>
    );
}
