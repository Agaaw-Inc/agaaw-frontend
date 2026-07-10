"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Tag, ArrowRight, Loader2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import * as api from "@/lib/api";
import { PublicBlog } from "@/lib/api";

export default function BlogsPreview() {
  const [blogs, setBlogs] = useState<PublicBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setIsLoading(true);
        const result = await api.getBlogs({ limit: 3 });
        setBlogs(result.data);
      } catch (err) {
        console.error("Failed to fetch trending blogs:", err);
        setError("Could not load latest articles");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <section className="py-10 bg-white px-6 w-full relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-50 rounded-full blur-[100px] opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-50 rounded-full blur-[100px] opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Latest from our <span className="text-teal-600">Community</span>
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed font-medium">
              Stay ahead with expert insights, success stories, and practical guides curated for your international journey.
            </p>
          </div>
          <Link
            href="/blogs"
            className="group flex items-center gap-3 text-teal-700 font-bold text-lg hover:text-teal-800 transition-all"
          >
            View all articles
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 animate-pulse h-[350px]" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
            <p className="text-gray-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group bg-white rounded-[2rem] p-8 border border-gray-100 hover:shadow-2xl hover:shadow-teal-900/5 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-lg border border-teal-100/50">
                    {blog.author.firstName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{blog.author.firstName} {blog.author.lastName}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
                  <Link href={`/blogs/${blog.slug}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {blog.title}
                  </Link>
                </h3>

                <p className="text-gray-500 text-sm line-clamp-3 mb-8 flex-grow leading-relaxed">
                  {blog.excerpt || blog.content.substring(0, 150).replace(/[#*]/g, '')}
                </p>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-tight bg-gray-50 text-gray-500 border border-gray-100 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                      {blog.category.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-teal-600 font-bold text-xs flex items-center gap-1.5 group-hover:gap-3 transition-all relative z-10">
                    READ <ArrowRight size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


