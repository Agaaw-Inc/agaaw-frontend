"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import {
    Globe,
    ShieldCheck,
    Users,
    Rocket,
    Target,
    CheckCircle2,
    ArrowRight,
    Search,
    MessageSquare,
    GraduationCap,
    Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

// Animation variants
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white selection:bg-elm/20">
            <MainNavbar />

            <main className="flex-grow">
                {/* HERO SECTION */}
                <section className="relative pt-32 pb-20 lg:pt-10 lg:pb-32 overflow-hidden">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-elm/5 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px]" />
                    </div>

                    <div className="container mx-auto px-6">
                        <motion.div
                            className="max-w-4xl mx-auto text-center"
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >

                            <motion.h1
                                variants={fadeInUp}
                                className="text-3xl lg:text-5xl font-bold tracking-tight text-codgray mb-8"
                            >
                                Transforming How The World <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-elm via-elm-light to-teal-500">Accesses Opportunity.</span>
                            </motion.h1>

                            <motion.p
                                variants={fadeInUp}
                                className="text-xl text-bombay mb-12 max-w-2xl mx-auto leading-relaxed"
                            >
                                Agaaw is more than a platform it&apos;s a global ecosystem built to bridge the gap between ambition and achievement for every student, everywhere.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/login">
                                    <Button className="w-full sm:w-auto bg-elm hover:bg-elm-dark text-white px-8 py-4 text-lg">
                                        Start Your Journey
                                    </Button>
                                </Link>
                                <Link href="/register/mentor">
                                    <button className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-codgray hover:text-elm transition-colors flex items-center justify-center gap-2">
                                        Become a Mentor <ArrowRight className="w-5 h-5" />
                                    </button>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* HERO VIDEO SECTION */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="mt-16 relative max-w-5xl mx-auto px-4"
                        >
                            <div className="relative group overflow-hidden rounded-[2rem] border border-gray-100 shadow-2xl bg-white">
                                <div className="absolute inset-0 bg-gradient-to-tr from-elm/10 via-transparent to-transparent z-10 pointer-events-none" />
                                <video
                                    src="/videos/about-us.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover rounded-[2rem] transform group-hover:scale-[1.02] transition-transform duration-700"
                                />
                                {/* Glassmorphism overlay info (optional, but adds premium feel) */}
                                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
                                </div>
                            </div>

                            {/* Background Decorative glow for the video */}
                            <div className="absolute -inset-4 bg-elm/5 rounded-[2.5rem] blur-2xl -z-10" />
                        </motion.div>
                    </div>
                </section>

                {/* OUR STORY SECTION */}
                <section className="py-24 bg-gray-50/50">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="lg:w-1/2 space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <h2 className="text-sm font-bold tracking-widest text-elm uppercase mb-3">Our Story</h2>
                                    <h3 className="text-4xl font-bold text-codgray leading-tight">
                                        Built from a simple realization: <br />
                                        <span className="text-elm">Guidance shouldn&apos;t be a luxury.</span>
                                    </h3>
                                </motion.div>

                                <motion.div
                                    className="space-y-6 text-lg text-gray-600 leading-relaxed"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <p>
                                        For decades, the path to global education was guarded by opaque agencies, exorbitant fees, and a lack of real-world guidance. We saw students losing their savings to fraudulent advisors and missing out on life-changing opportunities simply because they didn&apos;t have the right connections.
                                    </p>
                                    <p className="font-medium text-codgray">
                                        !! We decided to break the system !!
                                    </p>
                                    <p>
                                        Agaaw was born to create a direct, transparent ecosystem where those who have successfully navigated the journey (our mentors) help the next generation of students do the same. No middlemen, no hidden fees, just real stories and proven results.
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="grid grid-cols-2 gap-6 pt-6"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 mb-4">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-bold text-codgray mb-1">Stop Fraud</p>
                                        <p className="text-xs text-bombay">Eliminating predatory agency practices.</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="w-12 h-12 rounded-xl bg-elm/10 flex items-center justify-center text-elm mb-4">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-bold text-codgray mb-1">Direct Access</p>
                                        <p className="text-xs text-bombay">Real mentors, real guidance, real impact.</p>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="lg:w-1/2">
                                <motion.div
                                    className="relative"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                                        <Image
                                            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                                            alt="Students collaborating"
                                            width={800}
                                            height={600}
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-codgray/60 via-transparent to-transparent" />
                                    </div>
                                    {/* Decorative background element */}
                                    <div className="absolute -top-6 -right-6 w-full h-full border-2 border-elm/20 rounded-3xl -z-10" />
                                    <div className="absolute -bottom-6 -left-6 w-full h-full bg-teal-50 rounded-3xl -z-20" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MISSION & VISION */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl font-bold text-codgray mb-6"
                            >
                                Driving Global Impact through <br />
                                <span className="text-elm font-medium italic">Democratized Guidance.</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-lg text-bombay"
                            >
                                We are on a mission to ensure that no ambitious student is held back by their network or geography.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                className="group p-10 bg-gradient-to-br from-elm/5 to-transparent rounded-[2rem] border border-elm/10 hover:border-elm/30 transition-all duration-500"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-elm text-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <Target className="w-8 h-8" />
                                </div>
                                <h4 className="text-2xl font-bold text-codgray mb-4">Our Mission</h4>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    To democratize access to global education by connecting ambitious students directly with world-class mentors and verified opportunities, bypassing traditional barriers.
                                </p>
                            </motion.div>

                            <motion.div
                                className="group p-10 bg-gradient-to-br from-teal-50 to-transparent rounded-[2rem] border border-teal-100 hover:border-teal-200 transition-all duration-500"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-codgray text-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <Rocket className="w-8 h-8" />
                                </div>
                                <h4 className="text-2xl font-bold text-codgray mb-4">Our Vision</h4>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    To become the world&apos;s leading education marketplace where talent meets opportunity seamlessly, creating a future where every student can fly to their potential.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="py-24 bg-codgray text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-elm/5 blur-[100px] pointer-events-none" />

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-elm via-elm-light to-teal-500 text-4xl font-bold mb-6 ">Simple, Transparent, Impactful.</h2>
                            <p className="text-bombay text-lg max-w-2xl mx-auto text-white">
                                We&apos;ve distilled the complex study abroad journey into three simple steps.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                {
                                    icon: <Search className="w-8 h-8" />,
                                    title: "Discover",
                                    description: "Explore countries, universities, and scholarships that align with your unique goals."
                                },
                                {
                                    icon: <MessageSquare className="w-8 h-8" />,
                                    title: "Connect",
                                    description: "Match with real students and alumni who have been exactly where you are right now."
                                },
                                {
                                    icon: <GraduationCap className="w-8 h-8" />,
                                    title: "Achieve",
                                    description: "Get step-by-step application guidance and secure your future at your dream university."
                                }
                            ].map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    className="relative flex flex-col items-center text-center group"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                >
                                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-elm group-hover:border-elm transition-all duration-500">
                                        {step.icon}
                                    </div>
                                    <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
                                    <p className="text-bombay leading-relaxed">
                                        {step.description}
                                    </p>

                                    {idx < 2 && (
                                        <div className="hidden md:block absolute top-10 left-[70%] w-full h-[2px] bg-gradient-to-r from-white/10 to-transparent" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* WHY AGAAW IS DIFFERENT */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-16">
                            <div className="lg:w-1/3">
                                <h2 className="text-sm font-bold tracking-widest text-elm uppercase mb-3">Why Us</h2>
                                <h3 className="text-4xl font-bold text-codgray mb-8">
                                    The trust gap ends here.
                                </h3>
                                <p className="text-gray-600 text-lg mb-8">
                                    We didn&apos;t just build another agency. We built a platform that puts the power back in the hands of students.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        "Verified Mentor Profiles",
                                        "No Conflict of Interest",
                                        "Transparent Pricing",
                                        "Student-First Philosophy"
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-elm/10 flex items-center justify-center text-elm">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-codgray">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <motion.div
                                    className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500"
                                    whileHover={{ y: -10 }}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-6">
                                        <ShieldCheck className="w-7 h-7" />
                                    </div>
                                    <h4 className="text-xl font-bold text-codgray mb-4">Total Transparency</h4>
                                    <p className="text-gray-600">
                                        Every interaction is recorded, every mentor is verified, and every fee is clear. We have nothing to hide.
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500"
                                    whileHover={{ y: -10 }}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-elm/10 flex items-center justify-center text-elm mb-6">
                                        <Users className="w-7 h-7" />
                                    </div>
                                    <h4 className="text-xl font-bold text-codgray mb-4">Real Student Mentors</h4>
                                    <p className="text-gray-600">
                                        Our mentors are students and alumni from the world&apos;s top universities. They provide authentic, up-to-date advice.
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500"
                                    whileHover={{ y: -10 }}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-6">
                                        <Zap className="w-7 h-7" />
                                    </div>
                                    <h4 className="text-xl font-bold text-codgray mb-4">All-in-One Platform</h4>
                                    <p className="text-gray-600">
                                        From choosing a country to booking your first mentor session, everything happens in one seamless experience.
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500"
                                    whileHover={{ y: -10 }}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-6">
                                        <Globe className="w-7 h-7" />
                                    </div>
                                    <h4 className="text-xl font-bold text-codgray mb-4">Global Reach</h4>
                                    <p className="text-gray-600">
                                        With mentors across all over the world, we provide localized insights for a global perspective.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="py-24 bg-white overflow-hidden">
                    <div className="container mx-auto px-6">
                        <motion.div
                            className="bg-gradient-to-br from-elm to-elm-dark rounded-[3.5rem] p-10 lg:p-20 text-white relative overflow-hidden"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Abstract background elements */}
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[100px]" />
                                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-400/20 rounded-full blur-[100px]" />
                            </div>

                            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                                {/* Left Content */}
                                <div className="lg:w-1/2 text-center lg:text-left">
                                    <motion.h2
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="text-3xl lg:text-5xl font-bold mb-8 leading-tight"
                                    >
                                        Ready to start your <br />
                                        <span className="text-teal-200">global story?</span>
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 }}
                                        className="text-xl opacity-90 mb-12 max-w-xl"
                                    >
                                        Join thousands of students and mentors who are redefining global education access. Your future starts with a single connection.
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                        className="flex flex-col sm:flex-row items-center gap-6"
                                    >
                                        <Link href="/welcome/student" className="w-full sm:w-auto">
                                            <Button className="w-full sm:w-auto bg-black text-white hover:bg-gray-50 hover:text-black hover:shadow-xl hover:border-[#d7c96e]/40 border-none px-10 py-4 text-lg transform transition-all active:scale-95">
                                                Join as Student
                                            </Button>
                                        </Link>
                                        <Link href="/welcome/mentor" className="w-full sm:w-auto">
                                            <button className="w-full sm:w-auto px-10 py-4 text-lg font-bold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 group">
                                                Become a Mentor
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </Link>
                                    </motion.div>
                                </div>

                                {/* Right Illustration (SVG) */}
                                <div className="lg:w-1/2 relative flex items-center justify-center">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className="relative w-full max-w-[450px] aspect-square"
                                    >
                                        {/* Stylized Globe SVG */}
                                        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_20px_50px_rgba(255,255,255,0.15)]">
                                            {/* Outer Ring */}
                                            <motion.circle
                                                cx="200" cy="200" r="180"
                                                stroke="white" strokeWidth="1" strokeDasharray="10 10"
                                                strokeOpacity="0.2"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            />
                                            {/* Inner Glow */}
                                            <circle cx="200" cy="200" r="150" fill="url(#paint0_radial)" fillOpacity="0.1" />

                                            {/* Globe Base */}
                                            <circle cx="200" cy="200" r="140" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
                                            <path d="M60 200H340" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
                                            <path d="M200 60V340" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
                                            <ellipse cx="200" cy="200" rx="80" ry="140" stroke="white" strokeWidth="1" strokeOpacity="0.2" />

                                            {/* Connection Nodes */}
                                            <motion.circle cx="120" cy="120" r="8" fill="white" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
                                            <motion.circle cx="280" cy="220" r="6" fill="white" animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} />
                                            <motion.circle cx="180" cy="300" r="10" fill="white" animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 5, repeat: Infinity, delay: 2 }} />

                                            {/* Floating Icons */}
                                            <motion.g
                                                animate={{ y: [0, -20, 0] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <rect x="290" y="80" width="50" height="50" rx="12" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1" />
                                                <path d="M305 105L315 115L325 105" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </motion.g>

                                            <motion.g
                                                animate={{ y: [0, 20, 0] }}
                                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                            >
                                                <rect x="50" y="240" width="60" height="60" rx="15" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1" />
                                                <path d="M70 270H90M80 260V280" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            </motion.g>

                                            {/* Definitions */}
                                            <defs>
                                                <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 200) rotate(90) scale(150)">
                                                    <stop stopColor="white" />
                                                    <stop offset="1" stopColor="white" stopOpacity="0" />
                                                </radialGradient>
                                            </defs>
                                        </svg>

                                        {/* Floating Lucide Icons for real SVGs */}
                                        <motion.div
                                            animate={{ y: [-10, 10, -10] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                            className="absolute top-1/4 left-1/4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                                        >
                                            <GraduationCap className="w-8 h-8 text-white" />
                                        </motion.div>
                                        <motion.div
                                            animate={{ y: [15, -15, 15] }}
                                            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                            className="absolute bottom-1/4 right-1/4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                                        >
                                            <MessageSquare className="w-8 h-8 text-white" />
                                        </motion.div>
                                        <motion.div
                                            animate={{ scale: [0.9, 1.1, 0.9] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="absolute top-1/2 right-0 p-3 bg-elm/40 backdrop-blur-xl rounded-full border border-white/30"
                                        >
                                            <Users className="w-6 h-6 text-white" />
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
