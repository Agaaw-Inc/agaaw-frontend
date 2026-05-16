"use client";

import React, { useState } from "react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import { Mail, Phone, MapPin, Send, HelpCircle, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Student",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log("Form submitted:", formData);
    alert("Thank you for reaching out! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MainNavbar />

      <main className="flex-grow pb-24">
        {/* Hero Section */}
        <section className="bg-white py-20 px-8 border-b border-slate-100">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-codgray mb-6">
              Get in <span className="text-elm">Touch</span>
            </h1>
            <p className="text-lg text-bombay max-w-2xl mx-auto leading-relaxed">
              Have questions about scholarships, mentorship, or our platform?
              Our team is here to support your journey every step of the way.
            </p>
          </div>
        </section>

        {/* Contact Methods & Form */}
        <section className="px-8 -mt-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact Information Cards */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-elm/10 flex items-center justify-center text-elm mb-6">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-codgray mb-2">Email Us</h3>
                <p className="text-bombay text-sm mb-4">Direct your inquiries to our support team.</p>
                <a href="mailto:support@agaaw.com" className="text-elm font-semibold hover:underline">support@agaaw.com</a>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-elm/10 flex items-center justify-center text-elm mb-6">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-codgray mb-2">Call Us</h3>
                <p className="text-bombay text-sm mb-4">Available 24/7 via WhatsApp.</p>
                <a href="tel:+8801735081122" className="text-elm font-semibold hover:underline">+880 1735 081122</a>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-elm/10 flex items-center justify-center text-elm mb-6">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-codgray mb-2">Office</h3>
                <p className="text-bombay text-sm mb-4">Remote-first global team.</p>
                <span className="text-elm font-semibold">Based Worldwide 🌍</span>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-codgray mb-2">Send us a message</h2>
                  <p className="text-bombay">We usually reply within <span className="text-codgray font-semibold underline decoration-elm underline-offset-4">24 hours</span>.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-bold text-codgray uppercase tracking-wider">Full Name</label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-elm/20 focus:bg-white transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-bold text-codgray uppercase tracking-wider">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-elm/20 focus:bg-white transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-bold text-codgray uppercase tracking-wider">I am a...</label>
                    <div className="relative">
                      <select
                        id="subject"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-elm/20 focus:bg-white appearance-none transition-all cursor-pointer"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      >
                        <option value="Student">Student Looking for Guidance</option>
                        <option value="Mentor">Mentor Wanting to Join</option>
                        <option value="Support">Support / Technical Issue</option>
                        <option value="Business">Business / Partnership Inquiry</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ArrowRight className="w-4 h-4 rotate-90 text-bombay" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-bold text-codgray uppercase tracking-wider">Your Message</label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      placeholder="How can we help you?"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-elm/20 focus:bg-white transition-all resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-5 rounded-xl bg-codgray text-white font-bold text-lg hover:bg-elm transition-all flex items-center justify-center gap-3 ambient-shadow"
                  >
                    Send Message <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
