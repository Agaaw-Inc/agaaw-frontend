"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, BookOpen, Loader2 } from "lucide-react";
import { getMentorBlogs } from "@/lib/api";
import MentorBlogCard from "./MentorBlogCard";
import SectionCard from "@/components/dashboard/common/SectionCard";

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
        <SectionCard
            title="Blog & Resources"
            description="Manage your published content and drafts."
            icon={BookOpen}
            badge={
                blogs.length > 0 && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 bg-teal-50 text-teal-700 rounded-full">
                        {blogs.length} {blogs.length === 1 ? "Post" : "Posts"}
                    </span>
                )
            }
            actions={
                <>
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
                </>
            }
        >
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
                    {displayBlogs.map((blog: any) => (
                        <MentorBlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            )}
        </SectionCard>
    );
}
