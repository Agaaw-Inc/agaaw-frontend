"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, PenSquare, Calendar } from "lucide-react";

export default function MentorBlogPostsCard() {
    const blogs = [
        {
            id: 1,
            title: "Top 5 Countries for International Students in 2026",
            excerpt: "Choosing the right country for your studies is one of the most important decisions you'll make. Here are the top 5 desti...",
            date: "2026-02-03",
            tags: ["countries", "study abroad"],
        },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Blog Posts</h2>
                <Link
                    href="/dashboard/mentor/blogs/create"
                    className="flex items-center gap-1.5 text-sm text-teal-600 font-semibold hover:text-teal-700 transition-colors px-3 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-50"
                >
                    <PenSquare size={14} /> + Write Blog
                </Link>
            </div>

            {blogs.length === 0 ? (
                <div className="text-center py-10">
                    <BookOpen size={36} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-sm text-gray-400 mb-1">No blog posts yet</p>
                    <Link
                        href="/dashboard/mentor/blogs/create"
                        className="text-xs text-teal-600 font-medium hover:underline"
                    >
                        Write your first blog post
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {blogs.map((blog) => (
                        <Link
                            key={blog.id}
                            href={`/blogs/${blog.id}`}
                            className="block p-4 rounded-xl border border-gray-100 hover:border-teal-100 hover:bg-teal-50/30 transition-all group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                                    <BookOpen size={18} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                                        {blog.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        {blog.excerpt}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                                            <Calendar size={11} />
                                            {blog.date}
                                        </span>
                                        <div className="flex gap-1.5">
                                            {blog.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 bg-teal-50 text-teal-600 text-[10px] rounded-full font-semibold border border-teal-100"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <ArrowRight
                                    size={16}
                                    className="text-gray-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all mt-2 shrink-0"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
