"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import { 
    Plus, 
    Minus, 
    HelpCircle, 
    BookOpen, 
    Users, 
    ShieldCheck,
    MessageCircle,
    Globe,
    Zap
} from "lucide-react";

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={onClick}
                className="w-full py-6 flex items-center justify-between text-left group focus:outline-none"
            >
                <span className={`text-lg font-semibold transition-colors duration-300 ${isOpen ? "text-elm" : "text-codgray group-hover:text-elm"}`}>
                    {question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-elm text-white rotate-180" : "bg-gray-50 text-bombay"}`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-600 leading-relaxed max-w-3xl">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const faqs = [
    {
        category: "General",
        icon: <Globe className="w-5 h-5" />,
        items: [
            {
                question: "What is Agaaw?",
                answer: "Agaaw is a global education marketplace designed to connect ambitious students directly with verified mentors who have successfully navigated the international scholarship and university application process. We eliminate middlemen and provide transparent, real-world guidance."
            },
            {
                question: "Is Agaaw free to use?",
                answer: "Browsing scholarships, countries, and mentor profiles is completely free. We believe in open access to information. Some specialized services, such as 1-on-1 mentoring sessions or premium application reviews, may involve a fee which goes directly to the mentors."
            },
            {
                question: "How can Agaaw help me?",
                answer: "Whether you're looking for the right scholarship, need help choosing a study destination, or want expert feedback on your Statement of Purpose (SOP), Agaaw provides the tools and connections to make your journey successful."
            }
        ]
    },
    {
        category: "For Students",
        icon: <BookOpen className="w-5 h-5" />,
        items: [
            {
                question: "How do I find a mentor?",
                answer: "You can search our mentor directory by university, country, or field of study. Each mentor profile includes their background, achievements, and the services they offer. You can book a session directly through their profile."
            },
            {
                question: "Are the scholarships on Agaaw verified?",
                answer: "Yes, our team and our network of mentors constantly verify scholarship listings to ensure they are current and legitimate. We aim to protect students from fraudulent opportunities."
            },
            {
                question: "Can I apply for multiple scholarships?",
                answer: "Absolutely! In fact, we encourage it. Our platform allows you to track multiple opportunities and get guidance for each specific application requirement."
            }
        ]
    },
    {
        category: "For Mentors",
        icon: <Users className="w-5 h-5" />,
        items: [
            {
                question: "Who can become a mentor?",
                answer: "We welcome current international students and alumni who have a track record of success in securing scholarships or admissions to top global universities. You must undergo a verification process to ensure the quality of guidance on our platform."
            },
            {
                question: "What are the benefits of mentoring on Agaaw?",
                answer: "As a mentor, you can give back to your community, build your professional network, and earn an income by sharing your expertise. You have full control over your schedule and the services you offer."
            },
            {
                question: "How does the verification process work?",
                answer: "After signing up as a mentor, you'll need to provide proof of your student status or degree, along with details of your scholarship achievements. Our team reviews these documents before your profile goes live."
            }
        ]
    },
    {
        category: "Trust & Security",
        icon: <ShieldCheck className="w-5 h-5" />,
        items: [
            {
                question: "How do you ensure the quality of guidance?",
                answer: "We rely on a combination of rigorous mentor verification, a transparent rating and review system, and community reporting. We take feedback seriously to maintain the highest standards."
            },
            {
                question: "Is my personal data safe?",
                answer: "Yes, we use industry-standard encryption and follow strict privacy protocols to protect your data. We never share your personal information with third parties without your explicit consent."
            }
        ]
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>("General-0");

    const toggleItem = (categoryId: string, index: number) => {
        const id = `${categoryId}-${index}`;
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white selection:bg-elm/20">
            <MainNavbar />

            <main className="flex-grow pt-32 pb-24">
                {/* HERO SECTION */}
                <section className="relative overflow-hidden mb-20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-elm/5 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px]" />
                    </div>

                    <div className="container mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elm/10 text-elm text-sm font-medium mb-6">
                                <HelpCircle size={16} />
                                FAQ Center
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-codgray mb-6">
                                Everything you need <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-elm via-elm-light to-teal-500">to know about Agaaw.</span>
                            </h1>
                            <p className="text-xl text-bombay max-w-2xl mx-auto leading-relaxed">
                                Have questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking for, feel free to reach out to our support team.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* FAQ CONTENT */}
                <section className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        {faqs.map((category, catIdx) => (
                            <motion.div 
                                key={category.category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: catIdx * 0.1 }}
                                className="mb-16 last:mb-0"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-elm/10 flex items-center justify-center text-elm">
                                        {category.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold text-codgray">{category.category}</h2>
                                </div>

                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-8 overflow-hidden">
                                    {category.items.map((item, idx) => (
                                        <FAQItem
                                            key={idx}
                                            question={item.question}
                                            answer={item.answer}
                                            isOpen={openIndex === `${category.category}-${idx}`}
                                            onClick={() => toggleItem(category.category, idx)}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="container mx-auto px-6 mt-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-codgray rounded-[2.5rem] p-12 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-elm/5 blur-[80px] pointer-events-none" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-elm/20 flex items-center justify-center text-elm mx-auto mb-6">
                                <MessageCircle size={32} />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Still have questions?</h3>
                            <p className="text-bombay text-lg mb-8 max-w-xl mx-auto">
                                Can&apos;t find the answer you&apos;re looking for? Please chat with our friendly team.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a 
                                    href="mailto:support@agaaw.com"
                                    className="w-full sm:w-auto px-8 py-4 bg-elm hover:bg-elm-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-elm/20"
                                >
                                    Email Support
                                </a>
                                <a 
                                    href="/contact"
                                    className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all"
                                >
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
