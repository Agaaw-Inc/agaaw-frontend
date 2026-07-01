"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/shared/blog/BlogForm";
import { BlogFormValues } from "@/lib/validation/blogSchema";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { getMentorBlogById, updateMentorBlog } from "@/lib/api";

export default function MentorEditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [blog, setBlog] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const data = await getMentorBlogById(id);
                setBlog(data);
            } catch (err) {
                console.error("Failed to fetch blog post details:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

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
                excerpt: data.excerpt || null,
                metaDescription: data.metaDescription || null,
                coverImage: data.coverImage || null,
            };

            await updateMentorBlog(id, payload);
            router.push("/dashboard/mentor/blogs");
        } catch (err: any) {
            console.error("Error updating blog post:", err);
            alert(err.message || "Failed to update blog post. Please try again.");
            throw err;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
                <p className="text-sm font-semibold text-gray-500">Loading blog details...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Blog not found.</p>
                <Link href="/dashboard/mentor/blogs" className="text-teal-600 hover:underline text-sm mt-2 block">Back to Blogs</Link>
            </div>
        );
    }

    // Map tags array of objects from backend to comma separated string for form
    const tagsString = Array.isArray(blog.tags)
        ? blog.tags.map((t: any) => t.tag).join(", ")
        : "";

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6">
            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/mentor/blogs" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{blog.title}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <BlogForm
                        mode="edit"
                        defaultValues={{
                            title: blog.title,
                            slug: blog.slug,
                            content: blog.content,
                            authorId: blog.authorId,
                            category: blog.category,
                            excerpt: blog.excerpt || "",
                            metaDescription: blog.metaDescription || "",
                            coverImage: blog.coverImage || "",
                            readTime: blog.readTime || 5,
                            tags: tagsString,
                            isPublished: blog.isPublished,
                        }}
                        cancelHref="/dashboard/mentor/blogs"
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
