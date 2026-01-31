"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import { CheckCircle, Globe, Users, Linkedin } from "lucide-react";
import Image from "next/image";

// Animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

export default function AboutPage() {
    return (
        <>
            <MainNavbar />

            <main className="min-h-screen bg-gray-50 overflow-hidden">

                {/* HERO SECTION */}
                <section className="relative py-20 lg:py-32 bg-white overflow-hidden">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-elm to-teal-200 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
                    </div>

                    <motion.div
                        className="mx-auto max-w-7xl px-6 lg:px-8 text-center"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl font-bold tracking-tight text-codgray sm:text-6xl mb-6"
                        >
                            Bridging the Gap to Your <span className="text-elm">Global Future</span>
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="mt-6 text-lg leading-8 text-bombay max-w-2xl mx-auto"
                        >
                            Agaaw is on a mission to democratize access to global education and mentorship. We connect ambitious students with world-class mentors and scholarship opportunities.
                        </motion.p>
                    </motion.div>
                </section>

                {/* MISSION & VISION GRID */}
                <section className="py-20 mx-auto max-w-7xl px-6 lg:px-8">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-codgray">Our Mission</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                We believe that talent is everywhere, but opportunity is not. Our platform is designed to break down the barriers of geography and network, allowing students from all corners of the world to access the guidance and funding they need to succeed in top-tier international universities.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Personalized Mentorship matching",
                                    "Curated Scholarship database",
                                    "Step-by-step application guidance",
                                    "Community-driven support"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-elm" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Abstract visual representation */}
                        <div className="relative h-80 w-full rounded-2xl bg-gradient-to-br from-elm/10 to-transparent p-8 flex items-center justify-center border border-elm/20 shadow-sm">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-elm/20 rounded-full blur-2xl animate-pulse"></div>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                                    <Users className="w-8 h-8 text-elm mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-codgray">500+</div>
                                    <div className="text-xs text-bombay">Active Mentors</div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-md text-center mt-8">
                                    <Globe className="w-8 h-8 text-elm mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-codgray">50+</div>
                                    <div className="text-xs text-bombay">Countries</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* TEAM / VALUES SECTION */}
                <section className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h2 className="text-3xl font-bold tracking-tight text-codgray sm:text-4xl">Built by Students, for Students</h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                We are a team of former international students, engineers, and educators who have navigated this path ourselves. We know the struggle, and we are here to make it easier for you.
                            </p>
                        </div>
                        <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                            {/* Mock Team Members */}
                            {[
                                {
                                    name: "Omar Faruk",
                                    role: "Founder & CEO",
                                    image: "https://i.pravatar.cc/150?u=omar"
                                },
                                {
                                    name: "Sarah Chen",
                                    role: "Head of Mentorship",
                                    image: "https://i.pravatar.cc/150?u=sarah"
                                },
                                {
                                    name: "David Miller",
                                    role: "Lead Engineer",
                                    image: "https://i.pravatar.cc/150?u=david"
                                },
                            ].map((person, idx) => (
                                <li key={idx} className="group">
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="flex flex-col gap-4"
                                    >
                                        <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-gray-100">
                                            <Image
                                                src={person.image}
                                                alt={person.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold leading-8 tracking-tight text-codgray">{person.name}</h3>
                                            <p className="text-base leading-7 text-elm">{person.role}</p>
                                        </div>
                                    </motion.div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}
