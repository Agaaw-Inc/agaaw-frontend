"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Using mock data or custom data matching the image
const MENTORS = [
    {
        _key: "1",
        username: "nadia-islam",
        name: "Nadia Islam",
        title: "German Universities Expert",
        image: "https://i.pravatar.cc/150?img=5",
        tags: ["DAAD", "STEM"]
    },
    {
        _key: "2",
        username: "tanvir-hasan",
        name: "Tanvir Hasan",
        title: "MEXT Scholarship Specialist",
        image: "https://i.pravatar.cc/150?img=12",
        tags: ["JAPAN", "TECH"]
    },
    {
        _key: "3",
        username: "sarah-j",
        name: "Sarah J.",
        title: "Fulbright Scholar",
        image: "https://i.pravatar.cc/150?img=9",
        tags: ["USA", "ARTS"]
    },
    {
        _key: "4",
        username: "rahat-kabir",
        name: "Rahat Kabir",
        title: "Chevening Alumnus",
        image: "https://i.pravatar.cc/150?img=14",
        tags: ["UK", "MBA"]
    },
    {
        _key: "5",
        username: "sadia-khanam",
        name: "Sadia Khanam",
        title: "European Univs.",
        image: "https://i.pravatar.cc/150?img=32",
        tags: ["ERASMUS", "SCIENCE"]
    }
];

export default function MentorsSection() {
    return (
        <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Find a Mentor</h2>
                    {/* Add subtitle if needed, though image only has 'Find a Mentor' */}
                </div>
                <Link
                    href="/mentors"
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 group bg-teal-50 px-4 py-2 rounded-full transition-colors"
                >
                    See all mentors
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {MENTORS.map((mentor) => (
                    <Link
                        key={mentor._key}
                        href={`/profile/${mentor.username}`}
                        className="flex-shrink-0 w-[240px] flex flex-col items-center bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow group cursor-pointer"
                    >
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                            <Image
                                src={mentor.image}
                                alt={mentor.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 text-center w-full truncate">
                            {mentor.name}
                        </h3>
                        <p className="text-xs font-semibold text-teal-600 text-center w-full truncate mb-4">
                            {mentor.title}
                        </p>
                        
                        <div className="flex gap-2">
                            {mentor.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
