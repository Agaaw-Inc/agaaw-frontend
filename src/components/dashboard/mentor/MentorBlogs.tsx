"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Eye, EyeOff, BookOpen, Calendar, Tag, Loader2, Pencil, ArrowRight } from "lucide-react";
import { getMentorBlogs } from "@/lib/api";

export default function MentorBlogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getMentorBlogs()
            .then((data: any[]) => {
                setBlogs(Array.isArray(data) ? data : []);
            })
            .catch((err: any) => {
                console.error("Error fetching mentor blogs for dashboard widget:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const displayBlogs = blogs.slice(0, 4);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-900">Blog & Resources</h2>
                        {blogs.length > 0 && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 bg-teal-50 text-teal-700 rounded-full">
                                {blogs.length} {blogs.length === 1 ? "Post" : "Posts"}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Manage your published content and drafts.</p>
                </div>
                <div className="flex items-center gap-3">
                    {blogs.length > 4 && (
                        <Link
                            href="/dashboard/mentor/blogs"
                            className="text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline px-2 py-1"
                        >
                            View All
                        </Link>
                    )}
                    <Link
                        href="/dashboard/mentor/blogs/create"
                        className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow"
                    >
                        <Plus size={18} />
                        Create New Blog
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin text-teal-600 mb-2" />
                    <p className="text-xs font-medium">Loading blogs...</p>
                </div>
            ) : displayBlogs.length === 0 ? (
                <div className="border border-dashed border-gray-200 rounded-2xl p-10 text-center bg-gray-50/50">
                    <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
                    <h3 className="text-base font-semibold text-gray-700 mb-1">No blog posts yet</h3>
                    <p className="text-xs text-gray-400 mb-5 max-w-sm mx-auto">
                        Share your scholarship guidance, study tips, and admissions advice with students.
                    </p>
                    <Link
                        href="/dashboard/mentor/blogs/create"
                        className="inline-flex items-center gap-2 bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-teal-800 transition-colors shadow-sm"
                    >
                        <Plus size={14} /> Write Your First Blog
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayBlogs.map((blog: any) => {
                        const tagsList = Array.isArray(blog.tags)
                            ? blog.tags.map((t: any) => t.tag)
                            : [];

                        const defaultImg = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop";
                        const coverUrl = blog.coverImage && blog.coverImage.startsWith("http") ? blog.coverImage : defaultImg;

                        return (
                            <div
                                key={blog.id}
                                className="border border-gray-100 rounded-xl overflow-hidden hover:border-teal-100 hover:shadow-md transition-all flex flex-col group bg-white"
                            >
                                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                                    <Image
                                        src={coverUrl}
                                        alt={blog.title || "Blog image"}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                        <span
                                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-md ${
                                                blog.isPublished
                                                    ? "bg-emerald-500/90 text-white"
                                                    : "bg-amber-500/90 text-white"
                                            }`}
                                        >
                                            {blog.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {blog.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </span>
                                        {blog.category && (
                                            <span className="font-semibold text-teal-600 uppercase text-[10px] tracking-wider">
                                                {blog.category}
                                            </span>
                                        )}
                                    </div>

                                    <Link href={`/blogs/${blog.slug}`} className="hover:text-teal-700 transition-colors">
                                        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 leading-snug">
                                            {blog.title}
                                        </h3>
                                    </Link>

                                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                                        {blog.excerpt || blog.content}
                                    </p>

                                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-gray-500">
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Tag size={12} />
                                            {tagsList.length > 0 ? (
                                                <span className="line-clamp-1 max-w-[150px]">
                                                    {tagsList.slice(0, 2).join(", ")}
                                                </span>
                                            ) : (
                                                "No tags"
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/dashboard/mentor/blogs/edit/${blog.id}`}
                                                className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 text-xs font-bold hover:underline"
                                            >
                                                <Pencil size={13} /> Edit
                                            </Link>
                                            <Link
                                                href={`/blogs/${blog.slug}`}
                                                className="text-gray-400 hover:text-teal-600 transition-colors"
                                                title="View Blog"
                                            >
                                                <ArrowRight size={15} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
