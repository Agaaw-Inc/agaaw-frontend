"use client";

import { useRouter } from "next/navigation";
import BlogForm from "@/components/shared/blog/BlogForm";
import { BlogFormValues } from "@/lib/validation/blogSchema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createMentorBlog } from "@/lib/api";

export default function MentorCreateBlogPage() {
    const router = useRouter();

    const handleSubmit = async (data: BlogFormValues) => {
        try {
            const { authorId, ...rest } = data;
            // Process tags string to array
            const tagsArray = data.tags
                ? data.tags.split(",").map((t: string) => t.trim()).filter((t: string) => t.length > 0)
                : [];

            const payload = {
                ...rest,
                tags: tagsArray,
                // Ensure empty strings from optional fields are converted to undefined/null for backend
                excerpt: data.excerpt || null,
                metaDescription: data.metaDescription || null,
                coverImage: data.coverImage || null,
            };

            await createMentorBlog(payload);
            router.push("/dashboard/mentor/blogs");
        } catch (err: any) {
            console.error("Error creating blog post:", err);
            alert(err.message || "Failed to create blog post. Please try again.");
            throw err;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6">
            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/mentor/blogs" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Write New Blog</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Share your expertise to help students on their scholarship journey</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <BlogForm
                        mode="create"
                        cancelHref="/dashboard/mentor/blogs"
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
